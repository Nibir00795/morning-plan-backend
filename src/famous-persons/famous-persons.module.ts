import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamousPerson, FamousTask, TaskIcon } from '../entities';
import { FamousPersonsService } from './famous-persons.service';
import { FamousPersonsController } from './famous-persons.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FamousPerson, FamousTask, TaskIcon])],
  controllers: [FamousPersonsController],
  providers: [FamousPersonsService],
  exports: [FamousPersonsService],
})
export class FamousPersonsModule {}
