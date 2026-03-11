import { IsString, IsOptional, IsUUID, IsInt, Min } from 'class-validator';

export class CreateFamousTaskDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsUUID()
  iconId?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
