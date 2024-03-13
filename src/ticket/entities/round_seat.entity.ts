import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Schedule } from '../../schedule/entities/schedule.entity';
import { Seat } from '../../performance/entities/seat.entity';
import { SeatStatus } from '../types/seat-status.type';

@Entity({
  name: 'round_seats',
})
export class Round_Seat {
  @PrimaryGeneratedColumn()
  round_seat_id: number;

  @Column({
    type: 'enum',
    enum: SeatStatus,
    default: SeatStatus.reservation_availabe,
  })
  status: SeatStatus;

  @ManyToOne(() => Schedule, (schedule) => schedule.round_seat)
  @JoinColumn({ name: 'schedule_id' })
  schedule: Schedule;

  @Column({ type: 'int' })
  schedule_id: number;

  @ManyToOne(() => Seat, (seat) => seat.round_seat, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'seat_id' })
  seat: Seat;

  @Column({ type: 'int', name: 'seat_id' })
  seat_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
