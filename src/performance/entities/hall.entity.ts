import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Seat } from './seat.entity';
import { Performance } from './performance.entity';

@Entity({
  name: 'halls',
})
export class Hall {
  @PrimaryGeneratedColumn()
  hall_id: number;

  @Column({ type: 'varchar', unique: true })
  hall_name: string;

  @Column({ type: 'int' })
  seat_count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Seat, (seat) => seat.hall)
  seat: Seat;

  @OneToMany(() => Performance, (performance) => performance.hall)
  performance: Performance;
}
