import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreatePerformanceDto } from './dto/create-performance.dto';

import { Repository } from 'typeorm';
import _ from 'lodash';
import { Performance } from './entities/performance.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AwsService } from 'src/aws/aws.service';

@Injectable()
export class PerformanceService {
  constructor(
    @InjectRepository(Performance)
    private performanceRepository: Repository<Performance>,
    private awsService: AwsService,
  ) {}

  async search(keyword: string): Promise<Performance[]> {
    return await this.performanceRepository
      .createQueryBuilder('performance')
      .where('performance.title LIKE :keyword', { keyword: `%${keyword}%` })
      .getMany();
  }

  async findAllOrderBy(
    orderKey: 'created_at' | 'category',
  ): Promise<Performance[]> {
    return await this.performanceRepository.find({
      select: {
        performance_id: true,
        title: true,
        start_date: true,
        category: true,
      },
      order: { [orderKey]: 'ASC' },
    });
  }
  async findOne(performance_id: number): Promise<Performance[]> {
    return await this.performanceRepository
      .createQueryBuilder('performance')
      .leftJoin('performance.schedule', 'schedule')
      .leftJoin('performance.hall', 'hall')
      .where('performance.performance_id = :performance_id', { performance_id })
      .select([
        'performance',
        'schedule.status',
        'schedule.start_time',
        'schedule.remaining_seat',
        'schedule.schedule_date',
        'hall.hall_name',
      ])
      .getMany();
  }

  async createPerformance(createPerformanceDto: CreatePerformanceDto) {
    const { title, description, start_date, end_date, hall_id, category } =
      createPerformanceDto;
    const newPerformance = await this.performanceRepository.save({
      title: title,
      description: description,
      start_date: start_date,
      end_date: end_date,
      hall_id: hall_id,
      category: category,
    });
    return { newPerformance };
  }

  async uploadImage(image: Express.Multer.File, id: number) {
    if (!image) {
      throw new BadRequestException('파일이 전송되지 않았습니다.');
    }
    const performance = await this.performanceRepository.findOne({
      where: { performance_id: id },
    });
    if (_.isNil(performance)) {
      throw new NotFoundException('공연이 존재하지 않습니다.');
    }

    const ext = image.originalname.split('.')[1];
    const imageName = image.originalname.split('.')[0];
    const imageUrl = await this.awsService.imageUploadToS3(
      `${imageName}.${ext}`,
      image,
      ext,
    );

    performance.image = imageUrl;

    // 수정된 performance 엔티티를 저장
    await this.performanceRepository.save(performance);

    return { imageUrl };
  }
}
