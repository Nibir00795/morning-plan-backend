import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FamousPerson } from './famous-person.entity';
import { TaskIcon } from './task-icon.entity';

@Entity('famous_tasks')
export class FamousTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'famous_person_id' })
  famousPersonId: string;

  @Column()
  name: string;

  @Column({ name: 'icon_id', nullable: true })
  iconId: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => FamousPerson, (fp) => fp.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'famous_person_id' })
  famousPerson: FamousPerson;

  @ManyToOne(() => TaskIcon, { nullable: true })
  @JoinColumn({ name: 'icon_id' })
  icon: TaskIcon;
}
