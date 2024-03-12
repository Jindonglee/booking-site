import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Schedule } from './schedule.entity';
import { Seat } from './seat.entity';

enum Status {
  reservation_success,
  reservation_canceled,
}

@Entity({
  name: 'round_seats',
})
export class Round_Seat {
  @PrimaryGeneratedColumn()
  round_seat_id: number;

  @Column({ type: 'enum', enum: Status, default: Status.reservation_success })
  status: Status;

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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
