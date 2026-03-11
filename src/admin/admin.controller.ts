import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiSecurity, ApiOperation } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { AdminApiKeyGuard } from '../common/guards/admin-api-key.guard';
import { AdminService } from './admin.service';
import { CreateFamousPersonDto } from './dto/create-famous-person.dto';
import { UpdateFamousPersonDto } from './dto/update-famous-person.dto';
import { CreateFamousTaskDto } from './dto/create-famous-task.dto';
import { UpdateFamousTaskDto } from './dto/update-famous-task.dto';
import { CreateIconDto } from './dto/create-icon.dto';

@ApiTags('Admin')
@ApiSecurity('admin-api-key')
@Public()
@UseGuards(AdminApiKeyGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ── Famous Persons ──

  @Get('famous-persons')
  @ApiOperation({ summary: 'List all famous persons (admin)' })
  listPersons() {
    return this.adminService.listPersons();
  }

  @Post('famous-persons')
  @ApiOperation({ summary: 'Create a famous person with optional tasks' })
  createPerson(@Body() dto: CreateFamousPersonDto) {
    return this.adminService.createPerson(dto);
  }

  @Patch('famous-persons/:id')
  @ApiOperation({ summary: 'Update famous person details' })
  updatePerson(@Param('id') id: string, @Body() dto: UpdateFamousPersonDto) {
    return this.adminService.updatePerson(id, dto);
  }

  @Delete('famous-persons/:id')
  @ApiOperation({ summary: 'Delete a famous person and their tasks' })
  deletePerson(@Param('id') id: string) {
    return this.adminService.deletePerson(id);
  }

  // ── Famous Tasks ──

  @Post('famous-persons/:personId/tasks')
  @ApiOperation({ summary: 'Add a task to a famous person' })
  addTask(
    @Param('personId') personId: string,
    @Body() dto: CreateFamousTaskDto,
  ) {
    return this.adminService.addTask(personId, dto);
  }

  @Patch('famous-tasks/:taskId')
  @ApiOperation({ summary: 'Update a famous task' })
  updateTask(
    @Param('taskId') taskId: string,
    @Body() dto: UpdateFamousTaskDto,
  ) {
    return this.adminService.updateTask(taskId, dto);
  }

  @Delete('famous-tasks/:taskId')
  @ApiOperation({ summary: 'Delete a famous task' })
  deleteTask(@Param('taskId') taskId: string) {
    return this.adminService.deleteTask(taskId);
  }

  // ── Icons ──

  @Get('icons')
  @ApiOperation({ summary: 'List all task icons' })
  listIcons() {
    return this.adminService.listIcons();
  }

  @Post('icons')
  @ApiOperation({ summary: 'Create a new task icon' })
  createIcon(@Body() dto: CreateIconDto) {
    return this.adminService.createIcon(dto);
  }

  @Delete('icons/:id')
  @ApiOperation({ summary: 'Delete a task icon' })
  deleteIcon(@Param('id') id: string) {
    return this.adminService.deleteIcon(id);
  }
}
