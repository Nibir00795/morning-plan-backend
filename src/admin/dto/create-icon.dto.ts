import { IsString, IsOptional } from 'class-validator';

export class CreateIconDto {
  @IsString()
  name: string;

  /** App-bundled icon key (e.g. droplet, sun-01). Omit when using imageUrl. */
  @IsOptional()
  @IsString()
  assetKey?: string;

  /** URL of uploaded icon. Omit when using assetKey. */
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
