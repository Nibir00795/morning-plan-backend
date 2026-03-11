import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { UserTask } from './user-task.entity';

@Entity('reminders')
export class Reminder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'user_task_id', nullable: true })
  userTaskId: string;

  @Column({ name: 'day_of_week', type: 'smallint' })
  dayOfWeek: number;

  @Column({ type: 'time' })
  time: string; // HH:MM

  @Column({ name: 'is_enabled', default: true })
  isEnabled: boolean;

  @Column({ nullable: true })
  label: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.reminders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => UserTask, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_task_id' })
  userTask: UserTask;
}
