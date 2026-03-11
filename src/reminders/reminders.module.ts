import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { Reminder } from '../entities';
import { RemindersService } from './reminders.service';
import { RemindersController } from './reminders.controller';
import { ReminderProcessor } from './reminder.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reminder]),
    BullModule.registerQueue({ name: 'reminders' }),
  ],
  controllers: [RemindersController],
  providers: [RemindersService, ReminderProcessor],
  exports: [RemindersService],
})
export class RemindersModule {}
