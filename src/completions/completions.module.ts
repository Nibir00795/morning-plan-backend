import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskCompletion, UserTask, TaskDayAssignment } from '../entities';
import { CompletionsService } from './completions.service';
import { CompletionsController } from './completions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TaskCompletion, UserTask, TaskDayAssignment])],
  controllers: [CompletionsController],
  providers: [CompletionsService],
  exports: [CompletionsService],
})
export class CompletionsModule {}
