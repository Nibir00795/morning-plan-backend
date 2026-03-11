import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities';
import { RemindersService } from './reminders.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';

@ApiTags('Reminders')
@ApiBearerAuth('supabase-jwt')
@Controller('users/me/reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Get()
  @ApiOperation({ summary: 'List all reminders' })
  findAll(@CurrentUser() user: User) {
    return this.remindersService.findAll(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a reminder' })
  create(@CurrentUser() user: User, @Body() dto: CreateReminderDto) {
    return this.remindersService.create(user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a reminder' })
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateReminderDto,
  ) {
    return this.remindersService.update(user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a reminder' })
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.remindersService.remove(user.id, id);
  }
}
