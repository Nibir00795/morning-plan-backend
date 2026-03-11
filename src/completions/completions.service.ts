import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskCompletion, UserTask, TaskDayAssignment } from '../entities';

@Injectable()
export class CompletionsService {
  constructor(
    @InjectRepository(TaskCompletion) private completionRepo: Repository<TaskCompletion>,
    @InjectRepository(UserTask) private taskRepo: Repository<UserTask>,
    @InjectRepository(TaskDayAssignment) private dayRepo: Repository<TaskDayAssignment>,
  ) {}

  async completeTask(userId: string, taskId: string, date: string): Promise<TaskCompletion> {
    const task = await this.taskRepo.findOne({ where: { id: taskId, userId } });
    if (!task) throw new NotFoundException('Task not found');

    const existing = await this.completionRepo.findOne({
      where: { userId, userTaskId: taskId, completedOn: date },
    });
    if (existing) throw new ConflictException('Task already completed for this date');

    const completion = this.completionRepo.create({
      userId,
      userTaskId: taskId,
      completedOn: date,
    });
    return this.completionRepo.save(completion);
  }

  async uncompleteTask(userId: string, taskId: string, date: string): Promise<void> {
    const result = await this.completionRepo.delete({
      userId,
      userTaskId: taskId,
      completedOn: date,
    });
    if (result.affected === 0) throw new NotFoundException('Completion not found');
  }

  async getCompletionsForDate(userId: string, date: string): Promise<TaskCompletion[]> {
    return this.completionRepo.find({
      where: { userId, completedOn: date },
      relations: ['userTask'],
    });
  }

  async getDayProgress(userId: string, date: string): Promise<{
    total: number;
    completed: number;
    allDone: boolean;
  }> {
    const dayOfWeek = new Date(date).getDay();

    const tasksForDay = await this.taskRepo
      .createQueryBuilder('t')
      .innerJoin('t.dayAssignments', 'da', 'da.day_of_week = :dow', { dow: dayOfWeek })
      .where('t.user_id = :userId', { userId })
      .getCount();

    const completedCount = await this.completionRepo.count({
      where: { userId, completedOn: date },
    });

    return {
      total: tasksForDay,
      completed: completedCount,
      allDone: tasksForDay > 0 && completedCount >= tasksForDay,
    };
  }
}
