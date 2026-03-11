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
import { FamousPerson } from './famous-person.entity';

@Entity('user_favorites')
@Unique(['userId', 'famousPersonId'])
export class UserFavorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'famous_person_id' })
  famousPersonId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => FamousPerson, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'famous_person_id' })
  famousPerson: FamousPerson;
}
