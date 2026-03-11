import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DayStart } from '../entities';

@Injectable()
export class DayStartsService {
  constructor(
    @InjectRepository(DayStart) private dsRepo: Repository<DayStart>,
  ) {}

  async recordStart(userId: string): Promise<DayStart> {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];

    const existing = await this.dsRepo.findOne({
      where: { userId, startedDate: dateStr },
    });
    if (existing) return existing;

    const ds = this.dsRepo.create({
      userId,
      startedAt: now,
      startedDate: dateStr,
    });
    return this.dsRepo.save(ds);
  }

  async getHistory(userId: string, limit = 30): Promise<DayStart[]> {
    return this.dsRepo.find({
      where: { userId },
      order: { startedAt: 'DESC' },
      take: limit,
    });
  }

  async getByDate(userId: string, date: string): Promise<DayStart | null> {
    return this.dsRepo.findOne({
      where: { userId, startedDate: date },
    });
  }
}
