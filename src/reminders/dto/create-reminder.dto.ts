import {
  IsOptional,
  IsUUID,
  IsInt,
  Min,
  Max,
  IsString,
  Matches,
  IsBoolean,
} from 'class-validator';

export class CreateReminderDto {
  @IsOptional()
  @IsUUID()
  userTaskId?: string;

  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'time must be HH:MM format' })
  time: string;

  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @IsOptional()
  @IsString()
  label?: string;
}
