import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import _ from 'lodash';
import { compare, hash } from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Point } from './entities/point.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
    private readonly jwtService: JwtService,
  ) {}
  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException(
        '이미 해당 이메일로 가입한 사용자가 있습니다.',
      );
    }
    const hashedPassword = await hash(createUserDto.password, 10);
    const newUser = await this.userRepository.save({
      email: createUserDto.email,
      password: hashedPassword,
      nick_name: createUserDto.nick_name,
    });

    await this.pointRepository.save({
      user_id: newUser.user_id,
      point: 1000000,
      history: `+1000000`,
    });

    return { message: '회원가입에 성공하셨습니다.' };
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      select: ['user_id', 'email', 'password'],
      where: { email },
    });
    if (_.isNil(user)) {
      throw new UnauthorizedException('이메일을 확인해주세요');
    }
    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요');
    }

    const payload = { email, sub: user.user_id };

    return { access_token: this.jwtService.sign(payload) };
  }

  async findOne(user_id: number) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.point', 'point')
      .select([
        'user.user_id',
        'user.nick_name',
        'user.email',
        'user.role',
        'point.point',
      ])
      .where('user.user_id = :user_id', { user_id })
      .orderBy('point.createdAt', 'DESC')
      .getOne();

    if (_.isNil(user)) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  async findPoint(user_id: number) {
    return await this.pointRepository.find({
      where: { user_id },
      order: { ['createdAt']: 'DESC' },
    });
  }

  async update(user_id: number, updateUserDto: UpdateUserDto) {
    const { password, newPassword, nick_name } = updateUserDto;
    const user = await this.userRepository.findOne({
      select: ['password'],
      where: { user_id },
    });
    if (_.isNil(user)) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    if (!_.isNil(user.password) && !(await compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해 주세요');
    }
    const hashedPassword = await hash(newPassword, 10);

    const updateUser = this.userRepository.update(
      { user_id },
      { password: hashedPassword, nick_name: nick_name },
    );

    return { data: updateUser };
  }

  async delete(user_id: number, password: string) {
    const user = await this.userRepository.findOne({
      select: ['password'],
      where: { user_id },
    });
    if (_.isNil(user)) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    if (!_.isNil(user.password) && !(await compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해 주세요');
    }

    const deleteUser = await this.userRepository.delete({ user_id });

    return { message: '성공적으로 삭제되었습니다.' };
  }

  async minusPoint(user_id: number, point: number) {
    const currentPoint = await this.pointRepository
      .createQueryBuilder('point')
      .where('point.user_id = :user_id', { user_id })
      .orderBy('point.createdAt', 'DESC')
      .getOne();
    return await this.pointRepository.save({
      user_id,
      point: +currentPoint.point - point,
      history: `-${point}`,
    });
  }

  async plusPoint(user_id: number, point: number) {
    const currentPoint = await this.pointRepository
      .createQueryBuilder('point')
      .where('point.user_id = :user_id', { user_id })
      .orderBy('point.createdAt', 'DESC')
      .getOne();
    return await this.pointRepository.save({
      user_id,
      point: +currentPoint.point + point,
      history: `+${point}`,
    });
  }
}
