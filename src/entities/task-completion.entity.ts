import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { UserTask } from './user-task.entity';

@Entity('task_completions')
@Unique(['userId', 'userTaskId', 'completedOn'])
export class TaskCompletion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'user_task_id' })
  userTaskId: string;

  @Column({ name: 'completed_on', type: 'date' })
  completedOn: string; // YYYY-MM-DD

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.completions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => UserTask, (task) => task.completions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_task_id' })
  userTask: UserTask;
}
