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

export class UpdateReminderDto {
  @IsOptional()
  @IsUUID()
  userTaskId?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek?: number;

  @IsOptional()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'time must be HH:MM format' })
  time?: string;

  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @IsOptional()
  @IsString()
  label?: string;
}
