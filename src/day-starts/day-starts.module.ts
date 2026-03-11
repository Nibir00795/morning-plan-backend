import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DayStart } from '../entities';
import { DayStartsService } from './day-starts.service';
import { DayStartsController } from './day-starts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DayStart])],
  controllers: [DayStartsController],
  providers: [DayStartsService],
  exports: [DayStartsService],
})
export class DayStartsModule {}
