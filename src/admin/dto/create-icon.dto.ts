import { IsString } from 'class-validator';

export class CreateIconDto {
  @IsString()
  name: string;

  @IsString()
  assetKey: string;
}
