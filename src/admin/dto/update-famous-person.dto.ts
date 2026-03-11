import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateFamousPersonDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  profileImageUrl?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}
