import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { Seat } from 'src/performance/entities/seat.entity';
import { User } from 'src/user/entities/user.entity';
import _ from 'lodash';
import { Round_Seat } from './entities/round_seat.entity';
import { UserService } from 'src/user/user.service';
import { ScheduleService } from 'src/schedule/schedule.service';
import { SeatStatus } from './types/seat-status.type';
import { BookStatus } from './types/book-status.type';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(Round_Seat)
    private roundSeatRepository: Repository<Round_Seat>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>,
    private readonly userService: UserService,
    private readonly scheduleService: ScheduleService,
    private readonly dataSource: DataSource,
  ) {}

  async create(id: number, createTicketDto: CreateTicketDto) {
    const user_id = id;
    const { schedule_id, seat_id } = createTicketDto;

    const schedule = await this.scheduleService.checkRemainingSeat(schedule_id);

    const seat = await this.seatRepository.findOne({
      where: { seat_id },
    });

    const roundSeat = await this.roundSeatRepository
      .createQueryBuilder('round_seat')
      .where('round_seat.seat_id = :seat_id', { seat_id })
      .andWhere('round_seat.schedule_id = :schedule_id', { schedule_id })
      .getOne();

    if (roundSeat && roundSeat.status === '예약 불가') {
      throw new ConflictException('이미 예약된 좌석입니다.');
    }

    const user = await this.userService.findPoint(user_id);
    if (user[0].point < seat.price) {
      throw new BadRequestException('포인트가 부족합니다.');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      roundSeat.status = SeatStatus.reservation_disavailable;

      await queryRunner.manager.save(Round_Seat, roundSeat);
      await queryRunner.manager.save(Ticket, { user_id, schedule_id, seat_id });

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    await this.scheduleService.minusRemaingSeat(schedule_id);

    await this.userService.minusPoint(user_id, seat.price);

    return { message: '예약에 성공하셨습니다.' };
  }

  async findAll(id: number) {
    return await this.ticketRepository.find({
      where: { user_id: id },
      order: { ['created_at']: 'DESC' },
    });
  }

  async cancelTicket(user_id: number, ticket_id: number) {
    const ticket = await this.ticketRepository.findOne({
      where: { ticket_id },
    });

    if (ticket.status === '취소됨') {
      throw new BadRequestException('이미 취소된 티켓입니다.');
    }
    const roundSeat = await this.roundSeatRepository.findOne({
      where: { seat_id: ticket.seat_id, schedule_id: ticket.schedule_id },
    });
    await this.scheduleService.checkScheduleTime(ticket.schedule_id);
    const seat = await this.seatRepository.findOne({
      where: { seat_id: ticket.seat_id },
    });

    ticket.status = BookStatus.canceled;
    roundSeat.status = SeatStatus.reservation_availabe;
    await this.ticketRepository.save(ticket);
    await this.roundSeatRepository.save(roundSeat);
    await this.userService.plusPoint(user_id, seat.price);
    await this.scheduleService.plusRemaingSeat(ticket.schedule_id);

    return { ticket };
  }

  async findAllRemainingSeat(schedule_id: number) {
    return await this.seatRepository
      .createQueryBuilder('seat')
      .leftJoin('seat.round_seat', 'round_seat')
      .where('round_seat.schedule_id = :schedule_id', { schedule_id })
      .select(['seat', 'round_seat.status'])
      .getMany();
  }
}
