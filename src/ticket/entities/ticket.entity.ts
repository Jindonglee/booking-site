import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Seat } from 'src/performance/entities/seat.entity';
import { BookStatus } from '../types/book-status.type';

@Entity({
  name: 'tickets',
})
export class Ticket {
  @PrimaryGeneratedColumn()
  ticket_id: number;

  @ManyToOne(() => Schedule, (schedule) => schedule.ticket)
  @JoinColumn({ name: 'schedule_id' })
  schedule: Schedule;

  @Column({ type: 'int', name: 'schedule_id' })
  schedule_id: number;

  @ManyToOne(() => Seat, (seat) => seat.ticket)
  @JoinColumn({ name: 'seat_id' })
  seat: Seat;

  @Column({ type: 'int', name: 'seat_id' })
  seat_id: number;

  @ManyToOne(() => User, (user) => user.ticket)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', name: 'user_id' })
  user_id: number;

  @Column({ type: 'enum', enum: BookStatus, default: BookStatus.booked })
  status: BookStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
