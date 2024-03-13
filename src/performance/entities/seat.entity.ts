import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Hall } from './hall.entity';
import { Round_Seat } from '../../ticket/entities/round_seat.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';

@Entity({
  name: 'seats',
})
export class Seat {
  @PrimaryGeneratedColumn()
  seat_id: number;

  @ManyToOne(() => Hall, (hall) => hall.seat)
  @JoinColumn({ name: 'hall_id' })
  hall: Hall;

  @Column({ type: 'int', name: 'hall_id' })
  hall_id: number;

  @Column({ type: 'varchar', length: 255 })
  seat_name: string;

  @Column({ type: 'varchar' })
  grade: string;

  @Column({ type: 'int' })
  seat_num: number;

  @Column({ type: 'int' })
  price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Round_Seat, (round_seat) => round_seat.seat)
  round_seat: Round_Seat;

  @OneToMany(() => Ticket, (ticket) => ticket.seat)
  ticket: Ticket;
}
