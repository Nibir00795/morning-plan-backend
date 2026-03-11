import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskCompletion, UserTask, TaskDayAssignment } from '../entities';
import { StreaksService } from './streaks.service';
import { StreaksController } from './streaks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TaskCompletion, UserTask, TaskDayAssignment])],
  controllers: [StreaksController],
  providers: [StreaksService],
  exports: [StreaksService],
})
export class StreaksModule {}
