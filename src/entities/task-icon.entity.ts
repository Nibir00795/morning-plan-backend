import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('task_icons')
export class TaskIcon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ name: 'asset_key' })
  assetKey: string;
}
