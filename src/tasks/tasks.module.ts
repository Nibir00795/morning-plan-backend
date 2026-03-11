import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTask, TaskDayAssignment, FamousTask, TaskIcon, User } from '../entities';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserTask, TaskDayAssignment, FamousTask, TaskIcon, User]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
