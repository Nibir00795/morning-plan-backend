import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { RemindersService } from './reminders.service';

interface ReminderJobData {
  dayOfWeek: number;
  time: string;
}

@Processor('reminders')
export class ReminderProcessor {
  private readonly logger = new Logger(ReminderProcessor.name);

  constructor(private readonly remindersService: RemindersService) {}

  @Process('send-reminders')
  async handleSendReminders(job: Job<ReminderJobData>) {
    const { dayOfWeek, time } = job.data;
    this.logger.log(`Processing reminders for day=${dayOfWeek} time=${time}`);

    const reminders = await this.remindersService.getActiveRemindersForDayAndTime(
      dayOfWeek,
      time,
    );

    for (const reminder of reminders) {
      // TODO: integrate FCM/APNs push notification sending
      this.logger.log(
        `Would send push to user ${reminder.userId}: "${reminder.label || reminder.userTask?.name || 'Morning reminder'}"`,
      );
    }

    this.logger.log(`Processed ${reminders.length} reminders`);
  }
}
