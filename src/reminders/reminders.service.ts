import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reminder } from '../entities';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';

@Injectable()
export class RemindersService {
  constructor(
    @InjectRepository(Reminder) private reminderRepo: Repository<Reminder>,
  ) {}

  async findAll(userId: string): Promise<Reminder[]> {
    return this.reminderRepo.find({
      where: { userId },
      relations: ['userTask'],
      order: { dayOfWeek: 'ASC', time: 'ASC' },
    });
  }

  async create(userId: string, dto: CreateReminderDto): Promise<Reminder> {
    const reminder = this.reminderRepo.create({ ...dto, userId });
    return this.reminderRepo.save(reminder);
  }

  async update(userId: string, id: string, dto: UpdateReminderDto): Promise<Reminder> {
    const reminder = await this.reminderRepo.findOne({ where: { id, userId } });
    if (!reminder) throw new NotFoundException('Reminder not found');

    Object.assign(reminder, dto);
    return this.reminderRepo.save(reminder);
  }

  async remove(userId: string, id: string): Promise<void> {
    const reminder = await this.reminderRepo.findOne({ where: { id, userId } });
    if (!reminder) throw new NotFoundException('Reminder not found');
    await this.reminderRepo.remove(reminder);
  }

  async getActiveRemindersForDayAndTime(dayOfWeek: number, time: string): Promise<Reminder[]> {
    return this.reminderRepo.find({
      where: { dayOfWeek, time, isEnabled: true },
      relations: ['user', 'userTask'],
    });
  }
}
