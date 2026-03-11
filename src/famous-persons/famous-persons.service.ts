import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FamousPerson, FamousTask, TaskIcon } from '../entities';

@Injectable()
export class FamousPersonsService {
  constructor(
    @InjectRepository(FamousPerson) private fpRepo: Repository<FamousPerson>,
    @InjectRepository(FamousTask) private ftRepo: Repository<FamousTask>,
    @InjectRepository(TaskIcon) private iconRepo: Repository<TaskIcon>,
  ) {}

  async findAll(): Promise<FamousPerson[]> {
    return this.fpRepo.find({
      relations: ['tasks', 'tasks.icon'],
      order: { isFeatured: 'DESC', name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<FamousPerson | null> {
    return this.fpRepo.findOne({
      where: { id },
      relations: ['tasks', 'tasks.icon'],
    });
  }

  async getTasksByPerson(personId: string): Promise<FamousTask[]> {
    return this.ftRepo.find({
      where: { famousPersonId: personId },
      relations: ['icon'],
      order: { sortOrder: 'ASC' },
    });
  }

  async getIcons(): Promise<TaskIcon[]> {
    return this.iconRepo.find({ order: { name: 'ASC' } });
  }
}
