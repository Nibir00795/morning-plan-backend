import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { UserTask } from './user-task.entity';

@Entity('task_day_assignments')
@Unique(['userTaskId', 'dayOfWeek'])
export class TaskDayAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_task_id' })
  userTaskId: string;

  @Column({ name: 'day_of_week', type: 'smallint' })
  dayOfWeek: number; // 0=Sunday, 6=Saturday

  @ManyToOne(() => UserTask, (task) => task.dayAssignments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_task_id' })
  userTask: UserTask;
}
