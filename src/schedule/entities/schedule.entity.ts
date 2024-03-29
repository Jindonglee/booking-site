import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Performance } from '../../performance/entities/performance.entity';
import { Round_Seat } from '../../ticket/entities/round_seat.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { Status } from '../types/status.type';

@Entity({
  name: 'schedules',
})
export class Schedule {
  @PrimaryGeneratedColumn()
  schedule_id: number;

  @ManyToOne(() => Performance, (performance) => performance.schedule)
  @JoinColumn({ name: 'performance_id' })
  performance: Performance;

  @Column({ type: 'int', name: 'performance_id' })
  performance_id: number;

  @Column({ type: 'varchar' })
  performance_title: string;

  @Column({ type: 'int' })
  remaining_seat: number;

  @Column({ type: 'date' })
  schedule_date: Date;

  @Column({ type: 'time' })
  start_time: string;

  @Column({ type: 'time', nullable: true })
  end_time: string;

  @Column({ type: 'enum', enum: Status, default: Status.available })
  status: Status;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Round_Seat, (round_seat) => round_seat.schedule)
  round_seat: Round_Seat;

  @OneToMany(() => Ticket, (ticket) => ticket.schedule)
  ticket: Ticket;
}
