import {
  IsString,
  IsOptional,
  IsUUID,
  IsArray,
  IsInt,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsUUID()
  iconId?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  dayAssignments?: number[];
}
