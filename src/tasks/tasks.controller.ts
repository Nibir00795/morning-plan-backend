import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ImportFamousTasksDto } from './dto/import-famous-tasks.dto';

@ApiTags('Tasks')
@ApiBearerAuth('supabase-jwt')
@Controller('users/me/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tasks for current user' })
  findAll(@CurrentUser() user: User) {
    return this.tasksService.findAllForUser(user.id);
  }

  @Get('day')
  @ApiOperation({ summary: 'Get tasks assigned to a specific day of week' })
  @ApiQuery({ name: 'dayOfWeek', type: Number, description: '0=Sun, 1=Mon … 6=Sat' })
  findByDay(
    @CurrentUser() user: User,
    @Query('dayOfWeek', ParseIntPipe) dayOfWeek: number,
  ) {
    return this.tasksService.findTasksForDay(user.id, dayOfWeek);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user task' })
  create(@CurrentUser() user: User, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(user.id, dto);
  }

  @Post('from-famous')
  @ApiOperation({ summary: 'Bulk import tasks from a famous person' })
  importFromFamous(@CurrentUser() user: User, @Body() dto: ImportFamousTasksDto) {
    return this.tasksService.importFromFamous(user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user task' })
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user task' })
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.tasksService.remove(user.id, id);
  }
}
