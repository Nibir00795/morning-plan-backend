import { IsDateString } from 'class-validator';

export class CompleteTaskDto {
  @IsDateString()
  date: string; // YYYY-MM-DD
}
