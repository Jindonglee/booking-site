import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity({
  name: 'point',
})
export class Point {
  @PrimaryGeneratedColumn()
  pointId: number;

  @ManyToOne(() => User, (user) => user.point, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', name: 'user_id' })
  user_id: number;

  @Column({ type: 'int', nullable: false })
  point: number;

  @Column({ type: 'varchar', nullable: false })
  history: string;

  @CreateDateColumn()
  createdAt: Date;
}
