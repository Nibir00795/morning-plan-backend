import { IsString, IsOptional, IsObject } from 'class-validator';

export class LogEventDto {
  @IsString()
  eventType: string;

  @IsOptional()
  @IsObject()
  payload?: Record<string, any>;
}
