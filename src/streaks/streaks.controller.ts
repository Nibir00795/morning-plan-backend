import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities';
import { StreaksService } from './streaks.service';

@ApiTags('Streaks')
@ApiBearerAuth('supabase-jwt')
@Controller('users/me/streaks')
export class StreaksController {
  constructor(private readonly streaksService: StreaksService) {}

  @Get()
  @ApiOperation({ summary: 'Get overall user streak (consecutive all-tasks-done days)' })
  getOverall(@CurrentUser() user: User) {
    return this.streaksService.getOverallStreak(user.id);
  }

  @Get('tasks')
  @ApiOperation({ summary: 'Get streaks for all tasks' })
  getAllTaskStreaks(@CurrentUser() user: User) {
    return this.streaksService.getAllTaskStreaks(user.id);
  }

  @Get('tasks/:taskId')
  @ApiOperation({ summary: 'Get streak for a single task' })
  getTaskStreak(@CurrentUser() user: User, @Param('taskId') taskId: string) {
    return this.streaksService.getTaskStreak(user.id, taskId);
  }
}
