import { Controller, Post, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities';
import { DayStartsService } from './day-starts.service';

@ApiTags('Day Starts')
@ApiBearerAuth('supabase-jwt')
@Controller('users/me/day-starts')
export class DayStartsController {
  constructor(private readonly dayStartsService: DayStartsService) {}

  @Post()
  @ApiOperation({ summary: 'Record that the user started their day now' })
  recordStart(@CurrentUser() user: User) {
    return this.dayStartsService.recordStart(user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get day-start history' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getHistory(@CurrentUser() user: User, @Query('limit') limit?: string) {
    return this.dayStartsService.getHistory(user.id, limit ? parseInt(limit) : 30);
  }
}
