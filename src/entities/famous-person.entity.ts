import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { FamousTask } from './famous-task.entity';

@Entity('famous_persons')
export class FamousPerson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'profile_image_url', nullable: true })
  profileImageUrl: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ name: 'is_featured', default: false })
  isFeatured: boolean;

  @Column({ name: 'task_count', default: 0 })
  taskCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => FamousTask, (task) => task.famousPerson, { cascade: true })
  tasks: FamousTask[];
}
