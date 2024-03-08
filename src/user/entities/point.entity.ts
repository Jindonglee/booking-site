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

  @ManyToOne(() => User, (user) => user.point)
  @JoinColumn({ name: 'user_id' })
  user: User; // 사용자와의 관계를 나타내는 열입니다.

  @Column({ type: 'int', name: 'user_id' })
  user_id: number;

  @Column({ type: 'int', nullable: false })
  point: number;

  @Column({ type: 'varchar', nullable: false })
  history: string;

  @CreateDateColumn()
  createdAt: Date;
}
