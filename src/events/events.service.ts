import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEvent } from '../entities';
import { LogEventDto } from './dto/log-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(UserEvent) private eventRepo: Repository<UserEvent>,
  ) {}

  async log(userId: string, dto: LogEventDto): Promise<UserEvent> {
    const event = this.eventRepo.create({
      userId,
      eventType: dto.eventType,
      payload: dto.payload,
    });
    return this.eventRepo.save(event);
  }

  async logInternal(userId: string, eventType: string, payload?: Record<string, any>): Promise<void> {
    await this.eventRepo.save(
      this.eventRepo.create({ userId, eventType, payload }),
    );
  }

  async getEvents(
    userId: string,
    eventType?: string,
    limit = 50,
  ): Promise<UserEvent[]> {
    const where: any = { userId };
    if (eventType) where.eventType = eventType;
    return this.eventRepo.find({
      where,
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
