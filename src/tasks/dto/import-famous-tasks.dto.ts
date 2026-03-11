import { IsArray, IsUUID, IsOptional, IsInt, Min, Max } from 'class-validator';

export class ImportFamousTasksDto {
  @IsArray()
  @IsUUID('4', { each: true })
  famousTaskIds: string[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  dayAssignments?: number[];
}
