import { Controller, Post, Delete, Get, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities';
import { CompletionsService } from './completions.service';
import { CompleteTaskDto } from './dto/complete-task.dto';

@ApiTags('Completions')
@ApiBearerAuth('supabase-jwt')
@Controller('users/me/tasks')
export class CompletionsController {
  constructor(private readonly completionsService: CompletionsService) {}

  @Post(':id/complete')
  @ApiOperation({ summary: 'Mark a task as completed for a date' })
  complete(
    @CurrentUser() user: User,
    @Param('id') taskId: string,
    @Body() dto: CompleteTaskDto,
  ) {
    return this.completionsService.completeTask(user.id, taskId, dto.date);
  }

  @Delete(':id/complete')
  @ApiOperation({ summary: 'Undo task completion for a date' })
  uncomplete(
    @CurrentUser() user: User,
    @Param('id') taskId: string,
    @Body() dto: CompleteTaskDto,
  ) {
    return this.completionsService.uncompleteTask(user.id, taskId, dto.date);
  }

  @Get('completions')
  @ApiOperation({ summary: 'Get all completions for a specific date' })
  @ApiQuery({ name: 'date', type: String, description: 'YYYY-MM-DD' })
  getCompletions(
    @CurrentUser() user: User,
    @Query('date') date: string,
  ) {
    return this.completionsService.getCompletionsForDate(user.id, date);
  }

  @Get('day-progress')
  @ApiOperation({ summary: 'Get day progress (total vs completed)' })
  @ApiQuery({ name: 'date', type: String, description: 'YYYY-MM-DD' })
  getDayProgress(
    @CurrentUser() user: User,
    @Query('date') date: string,
  ) {
    return this.completionsService.getDayProgress(user.id, date);
  }
}
