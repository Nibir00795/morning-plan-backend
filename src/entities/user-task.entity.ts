import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { TaskIcon } from './task-icon.entity';
import { FamousTask } from './famous-task.entity';
import { TaskDayAssignment } from './task-day-assignment.entity';
import { TaskCompletion } from './task-completion.entity';

@Entity('user_tasks')
export class UserTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  name: string;

  @Column({ name: 'icon_id', nullable: true })
  iconId: string;

  @Column({ name: 'source_famous_task_id', nullable: true })
  sourceFamousTaskId: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => TaskIcon, { nullable: true })
  @JoinColumn({ name: 'icon_id' })
  icon: TaskIcon;

  @ManyToOne(() => FamousTask, { nullable: true })
  @JoinColumn({ name: 'source_famous_task_id' })
  sourceFamousTask: FamousTask;

  @OneToMany(() => TaskDayAssignment, (a) => a.userTask, { cascade: true })
  dayAssignments: TaskDayAssignment[];

  @OneToMany(() => TaskCompletion, (c) => c.userTask)
  completions: TaskCompletion[];
}
