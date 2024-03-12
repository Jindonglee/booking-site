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
import { Schedule } from './schedule.entity';

@Entity({
  name: 'performances',
})
export class Performance {
  @PrimaryGeneratedColumn()
  performance_id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @Column({ type: 'varchar' })
  category: string;

  @ManyToOne(() => Hall, (hall) => hall.performance)
  @JoinColumn({ name: 'hall_id' })
  hall: Hall;

  @Column({ type: 'int', name: 'hall_id' })
  hall_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Schedule, (schedule) => schedule.performance)
  schedule: Schedule;
}
