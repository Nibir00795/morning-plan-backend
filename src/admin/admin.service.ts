import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FamousPerson, FamousTask, TaskIcon } from '../entities';
import { CreateFamousPersonDto } from './dto/create-famous-person.dto';
import { UpdateFamousPersonDto } from './dto/update-famous-person.dto';
import { CreateFamousTaskDto } from './dto/create-famous-task.dto';
import { UpdateFamousTaskDto } from './dto/update-famous-task.dto';
import { CreateIconDto } from './dto/create-icon.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(FamousPerson) private fpRepo: Repository<FamousPerson>,
    @InjectRepository(FamousTask) private ftRepo: Repository<FamousTask>,
    @InjectRepository(TaskIcon) private iconRepo: Repository<TaskIcon>,
  ) {}

  // ── Famous Persons ──

  async createPerson(dto: CreateFamousPersonDto): Promise<FamousPerson> {
    const person = this.fpRepo.create({
      name: dto.name,
      profileImageUrl: dto.profileImageUrl,
      bio: dto.bio,
      isFeatured: dto.isFeatured ?? false,
      taskCount: 0,
    });
    const saved = await this.fpRepo.save(person);

    if (dto.tasks?.length) {
      const tasks = dto.tasks.map((t, i) =>
        this.ftRepo.create({
          famousPersonId: saved.id,
          name: t.name,
          iconId: t.iconId,
          sortOrder: t.sortOrder ?? i,
        }),
      );
      await this.ftRepo.save(tasks);
      saved.taskCount = tasks.length;
      await this.fpRepo.save(saved);
    }

    return this.fpRepo.findOneOrFail({
      where: { id: saved.id },
      relations: ['tasks', 'tasks.icon'],
    });
  }

  async updatePerson(
    id: string,
    dto: UpdateFamousPersonDto,
  ): Promise<FamousPerson> {
    const person = await this.fpRepo.findOne({ where: { id } });
    if (!person) throw new NotFoundException('Famous person not found');

    Object.assign(person, dto);
    await this.fpRepo.save(person);

    return this.fpRepo.findOneOrFail({
      where: { id },
      relations: ['tasks', 'tasks.icon'],
    });
  }

  async deletePerson(id: string): Promise<void> {
    const person = await this.fpRepo.findOne({ where: { id } });
    if (!person) throw new NotFoundException('Famous person not found');
    await this.fpRepo.remove(person);
  }

  async listPersons(): Promise<FamousPerson[]> {
    return this.fpRepo.find({
      relations: ['tasks', 'tasks.icon'],
      order: { createdAt: 'DESC' },
    });
  }

  // ── Famous Tasks ──

  async addTask(
    personId: string,
    dto: CreateFamousTaskDto,
  ): Promise<FamousTask> {
    const person = await this.fpRepo.findOne({ where: { id: personId } });
    if (!person) throw new NotFoundException('Famous person not found');

    const maxSort = await this.ftRepo
      .createQueryBuilder('ft')
      .where('ft.famous_person_id = :personId', { personId })
      .select('MAX(ft.sort_order)', 'max')
      .getRawOne();

    const task = this.ftRepo.create({
      famousPersonId: personId,
      name: dto.name,
      iconId: dto.iconId,
      sortOrder: dto.sortOrder ?? (maxSort?.max ?? -1) + 1,
    });
    const saved = await this.ftRepo.save(task);

    person.taskCount = await this.ftRepo.count({
      where: { famousPersonId: personId },
    });
    await this.fpRepo.save(person);

    return this.ftRepo.findOneOrFail({
      where: { id: saved.id },
      relations: ['icon'],
    });
  }

  async updateTask(taskId: string, dto: UpdateFamousTaskDto): Promise<FamousTask> {
    const task = await this.ftRepo.findOne({
      where: { id: taskId },
      relations: ['icon'],
    });
    if (!task) throw new NotFoundException('Task not found');

    Object.assign(task, dto);
    return this.ftRepo.save(task);
  }

  async deleteTask(taskId: string): Promise<void> {
    const task = await this.ftRepo.findOne({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');

    const personId = task.famousPersonId;
    await this.ftRepo.remove(task);

    const person = await this.fpRepo.findOne({ where: { id: personId } });
    if (person) {
      person.taskCount = await this.ftRepo.count({
        where: { famousPersonId: personId },
      });
      await this.fpRepo.save(person);
    }
  }

  // ── Icons ──

  async createIcon(dto: CreateIconDto): Promise<TaskIcon> {
    const existing = await this.iconRepo.findOne({
      where: { name: dto.name },
    });
    if (existing)
      throw new ConflictException(`Icon with name "${dto.name}" already exists`);

    if (!dto.assetKey && !dto.imageUrl) {
      throw new ConflictException(
        'Provide either assetKey (app-bundled) or imageUrl (uploaded icon)',
      );
    }

    return this.iconRepo.save(
      this.iconRepo.create({
        name: dto.name,
        assetKey: dto.assetKey ?? null,
        imageUrl: dto.imageUrl ?? null,
      }),
    );
  }

  async listIcons(): Promise<TaskIcon[]> {
    return this.iconRepo.find({ order: { name: 'ASC' } });
  }

  async deleteIcon(id: string): Promise<void> {
    const icon = await this.iconRepo.findOne({ where: { id } });
    if (!icon) throw new NotFoundException('Icon not found');
    await this.iconRepo.remove(icon);
  }
}
