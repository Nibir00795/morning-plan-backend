import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UserTask, TaskDayAssignment, FamousTask, User, SubscriptionTier } from '../entities';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ImportFamousTasksDto } from './dto/import-famous-tasks.dto';

@Injectable()
export class TasksService {
  private freeLimit: number;
  private premiumLimit: number;

  constructor(
    @InjectRepository(UserTask) private taskRepo: Repository<UserTask>,
    @InjectRepository(TaskDayAssignment) private dayRepo: Repository<TaskDayAssignment>,
    @InjectRepository(FamousTask) private famousTaskRepo: Repository<FamousTask>,
    @InjectRepository(User) private userRepo: Repository<User>,
    config: ConfigService,
  ) {
    this.freeLimit = config.get<number>('FREE_TASK_LIMIT', 3);
    this.premiumLimit = config.get<number>('PREMIUM_TASK_LIMIT', 50);
  }

  private async checkTaskLimit(userId: string, countToAdd = 1): Promise<void> {
    const user = await this.userRepo.findOneOrFail({ where: { id: userId } });
    const currentCount = await this.taskRepo.count({ where: { userId } });
    const limit = user.subscriptionTier === SubscriptionTier.PREMIUM
      ? this.premiumLimit
      : this.freeLimit;

    if (currentCount + countToAdd > limit) {
      throw new ForbiddenException(
        `Task limit reached (${limit}). ${user.subscriptionTier === SubscriptionTier.FREE ? 'Upgrade to premium for more tasks.' : ''}`,
      );
    }
  }

  async findAllForUser(userId: string): Promise<UserTask[]> {
    return this.taskRepo.find({
      where: { userId },
      relations: ['icon', 'dayAssignments'],
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  async findTasksForDay(userId: string, dayOfWeek: number): Promise<UserTask[]> {
    const allTasks = await this.taskRepo.find({
      where: { userId },
      relations: ['icon', 'dayAssignments'],
      order: { sortOrder: 'ASC' },
    });

    return allTasks.filter((task) => {
      if (task.dayAssignments.length === 0) return false;
      return task.dayAssignments.some((a) => a.dayOfWeek === dayOfWeek);
    });
  }

  async create(userId: string, dto: CreateTaskDto): Promise<UserTask> {
    await this.checkTaskLimit(userId);

    const maxSort = await this.taskRepo
      .createQueryBuilder('t')
      .select('MAX(t.sort_order)', 'max')
      .where('t.user_id = :userId', { userId })
      .getRawOne();

    const task = this.taskRepo.create({
      userId,
      name: dto.name,
      iconId: dto.iconId,
      sortOrder: (maxSort?.max ?? -1) + 1,
    });
    const saved = await this.taskRepo.save(task);

    if (dto.dayAssignments?.length) {
      await this.setDayAssignments(saved.id, dto.dayAssignments);
    }

    return this.taskRepo.findOneOrFail({
      where: { id: saved.id },
      relations: ['icon', 'dayAssignments'],
    });
  }

  async update(userId: string, taskId: string, dto: UpdateTaskDto): Promise<UserTask> {
    const task = await this.taskRepo.findOne({
      where: { id: taskId, userId },
      relations: ['dayAssignments'],
    });
    if (!task) throw new NotFoundException('Task not found');

    if (dto.name !== undefined) task.name = dto.name;
    if (dto.iconId !== undefined) task.iconId = dto.iconId;
    if (dto.sortOrder !== undefined) task.sortOrder = dto.sortOrder;
    await this.taskRepo.save(task);

    if (dto.dayAssignments !== undefined) {
      await this.setDayAssignments(taskId, dto.dayAssignments);
    }

    return this.taskRepo.findOneOrFail({
      where: { id: taskId },
      relations: ['icon', 'dayAssignments'],
    });
  }

  async remove(userId: string, taskId: string): Promise<void> {
    const task = await this.taskRepo.findOne({ where: { id: taskId, userId } });
    if (!task) throw new NotFoundException('Task not found');
    await this.taskRepo.remove(task);
  }

  async importFromFamous(userId: string, dto: ImportFamousTasksDto): Promise<UserTask[]> {
    await this.checkTaskLimit(userId, dto.famousTaskIds.length);

    const famousTasks = await this.famousTaskRepo.find({
      where: { id: In(dto.famousTaskIds) },
    });

    if (famousTasks.length !== dto.famousTaskIds.length) {
      throw new BadRequestException('Some famous task IDs are invalid');
    }

    const maxSort = await this.taskRepo
      .createQueryBuilder('t')
      .select('MAX(t.sort_order)', 'max')
      .where('t.user_id = :userId', { userId })
      .getRawOne();
    let sortOrder = (maxSort?.max ?? -1) + 1;

    const created: UserTask[] = [];
    for (const ft of famousTasks) {
      const task = this.taskRepo.create({
        userId,
        name: ft.name,
        iconId: ft.iconId,
        sourceFamousTaskId: ft.id,
        sortOrder: sortOrder++,
      });
      const saved = await this.taskRepo.save(task);

      if (dto.dayAssignments?.length) {
        await this.setDayAssignments(saved.id, dto.dayAssignments);
      }

      created.push(saved);
    }

    return this.taskRepo.find({
      where: { id: In(created.map((t) => t.id)) },
      relations: ['icon', 'dayAssignments'],
    });
  }

  private async setDayAssignments(taskId: string, days: number[]): Promise<void> {
    await this.dayRepo.delete({ userTaskId: taskId });
    if (days.length > 0) {
      const assignments = days.map((d) =>
        this.dayRepo.create({ userTaskId: taskId, dayOfWeek: d }),
      );
      await this.dayRepo.save(assignments);
    }
  }
}
