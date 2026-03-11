import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamousPerson, FamousTask, TaskIcon } from '../entities';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FamousPerson, FamousTask, TaskIcon])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
