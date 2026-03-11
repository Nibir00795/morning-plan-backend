import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('task_icons')
export class TaskIcon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  /** App-bundled icon identifier (e.g. droplet, sun-01). Used when imageUrl is null. */
  @Column({ name: 'asset_key', nullable: true })
  assetKey: string | null;

  /** URL of uploaded icon image. When set, app uses this instead of assetKey. */
  @Column({ name: 'image_url', nullable: true })
  imageUrl: string | null;
}
