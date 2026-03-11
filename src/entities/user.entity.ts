import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserTask } from './user-task.entity';
import { UserFavorite } from './user-favorite.entity';
import { DayStart } from './day-start.entity';
import { Reminder } from './reminder.entity';
import { UserEvent } from './user-event.entity';
import { TaskCompletion } from './task-completion.entity';

export enum AuthProvider {
  GOOGLE = 'google',
  APPLE = 'apple',
  ANONYMOUS = 'anonymous',
}

export enum SubscriptionTier {
  FREE = 'free',
  PREMIUM = 'premium',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  email: string;

  @Column({ name: 'display_name', nullable: true })
  displayName: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @Column({ name: 'auth_provider', type: 'enum', enum: AuthProvider, default: AuthProvider.ANONYMOUS })
  authProvider: AuthProvider;

  @Column({ name: 'supabase_uid', nullable: true, unique: true })
  supabaseUid: string;

  @Column({ name: 'is_guest', default: true })
  isGuest: boolean;

  @Column({
    name: 'subscription_tier',
    type: 'enum',
    enum: SubscriptionTier,
    default: SubscriptionTier.FREE,
  })
  subscriptionTier: SubscriptionTier;

  @Column({ name: 'revenuecat_id', nullable: true })
  revenuecatId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => UserTask, (task) => task.user)
  tasks: UserTask[];

  @OneToMany(() => UserFavorite, (fav) => fav.user)
  favorites: UserFavorite[];

  @OneToMany(() => DayStart, (ds) => ds.user)
  dayStarts: DayStart[];

  @OneToMany(() => Reminder, (r) => r.user)
  reminders: Reminder[];

  @OneToMany(() => UserEvent, (e) => e.user)
  events: UserEvent[];

  @OneToMany(() => TaskCompletion, (c) => c.user)
  completions: TaskCompletion[];
}
