import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities';
import { EventsService } from './events.service';
import { LogEventDto } from './dto/log-event.dto';

@ApiTags('Events')
@ApiBearerAuth('supabase-jwt')
@Controller('users/me/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: 'Log a user behaviour event' })
  logEvent(@CurrentUser() user: User, @Body() dto: LogEventDto) {
    return this.eventsService.log(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user event history' })
  @ApiQuery({ name: 'type', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getEvents(
    @CurrentUser() user: User,
    @Query('type') eventType?: string,
    @Query('limit') limit?: string,
  ) {
    return this.eventsService.getEvents(
      user.id,
      eventType,
      limit ? parseInt(limit) : 50,
    );
  }
}
