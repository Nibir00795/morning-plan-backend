import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskCompletion, UserTask, TaskDayAssignment } from '../entities';

export interface TaskStreak {
  taskId: string;
  taskName: string;
  currentStreak: number;
  longestStreak: number;
}

export interface OverallStreak {
  currentStreak: number;
  longestStreak: number;
}

@Injectable()
export class StreaksService {
  constructor(
    @InjectRepository(TaskCompletion) private completionRepo: Repository<TaskCompletion>,
    @InjectRepository(UserTask) private taskRepo: Repository<UserTask>,
    @InjectRepository(TaskDayAssignment) private dayRepo: Repository<TaskDayAssignment>,
  ) {}

  async getTaskStreak(userId: string, taskId: string): Promise<TaskStreak> {
    const task = await this.taskRepo.findOne({ where: { id: taskId, userId } });
    if (!task) return { taskId, taskName: '', currentStreak: 0, longestStreak: 0 };

    const completions = await this.completionRepo.find({
      where: { userId, userTaskId: taskId },
      order: { completedOn: 'DESC' },
    });

    const dates = completions.map((c) => c.completedOn);
    const { current, longest } = this.calculateStreak(dates);

    return {
      taskId,
      taskName: task.name,
      currentStreak: current,
      longestStreak: longest,
    };
  }

  async getAllTaskStreaks(userId: string): Promise<TaskStreak[]> {
    const tasks = await this.taskRepo.find({ where: { userId } });
    const streaks: TaskStreak[] = [];
    for (const task of tasks) {
      streaks.push(await this.getTaskStreak(userId, task.id));
    }
    return streaks;
  }

  async getOverallStreak(userId: string): Promise<OverallStreak> {
    const tasks = await this.taskRepo.find({
      where: { userId },
      relations: ['dayAssignments'],
    });

    if (tasks.length === 0) return { currentStreak: 0, longestStreak: 0 };

    const completions = await this.completionRepo.find({
      where: { userId },
      order: { completedOn: 'DESC' },
    });

    const completionsByDate = new Map<string, Set<string>>();
    for (const c of completions) {
      if (!completionsByDate.has(c.completedOn)) {
        completionsByDate.set(c.completedOn, new Set());
      }
      completionsByDate.get(c.completedOn)!.add(c.userTaskId);
    }

    const allDates = Array.from(completionsByDate.keys()).sort().reverse();
    if (allDates.length === 0) return { currentStreak: 0, longestStreak: 0 };

    let currentStreak = 0;
    let longestStreak = 0;
    let streak = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let checkDate = new Date(today);

    const isAllTasksDoneForDate = (dateStr: string): boolean => {
      const d = new Date(dateStr);
      const dow = d.getDay();
      const tasksForDay = tasks.filter((t) =>
        t.dayAssignments.some((a) => a.dayOfWeek === dow),
      );
      if (tasksForDay.length === 0) return false;

      const completedIds = completionsByDate.get(dateStr);
      if (!completedIds) return false;

      return tasksForDay.every((t) => completedIds.has(t.id));
    };

    // Walk backwards from today
    for (let i = 0; i < 365; i++) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const dow = checkDate.getDay();
      const hasTasksForDay = tasks.some((t) =>
        t.dayAssignments.some((a) => a.dayOfWeek === dow),
      );

      if (!hasTasksForDay) {
        checkDate.setDate(checkDate.getDate() - 1);
        continue;
      }

      if (isAllTasksDoneForDate(dateStr)) {
        streak++;
        longestStreak = Math.max(longestStreak, streak);
      } else {
        if (i === 0) {
          // Today not done yet is ok, continue checking yesterday
          checkDate.setDate(checkDate.getDate() - 1);
          continue;
        }
        break;
      }

      checkDate.setDate(checkDate.getDate() - 1);
    }

    currentStreak = streak;

    // Recalculate longest by scanning all
    streak = 0;
    const sortedDatesAsc = Array.from(completionsByDate.keys()).sort();
    let prevDate: Date | null = null;
    for (const dateStr of sortedDatesAsc) {
      if (isAllTasksDoneForDate(dateStr)) {
        if (prevDate) {
          const curr = new Date(dateStr);
          const diff = (curr.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
          if (diff <= 1) {
            streak++;
          } else {
            streak = 1;
          }
        } else {
          streak = 1;
        }
        longestStreak = Math.max(longestStreak, streak);
        prevDate = new Date(dateStr);
      } else {
        streak = 0;
        prevDate = null;
      }
    }

    return { currentStreak, longestStreak };
  }

  private calculateStreak(datesDesc: string[]): { current: number; longest: number } {
    if (datesDesc.length === 0) return { current: 0, longest: 0 };

    const sorted = [...datesDesc].sort().reverse();
    let current = 0;
    let longest = 0;
    let streak = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let expected = new Date(today);

    // Allow today or yesterday as starting point
    const firstDate = new Date(sorted[0]);
    firstDate.setHours(0, 0, 0, 0);
    const diffFromToday = (today.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diffFromToday > 1) return { current: 0, longest: this.calcLongest(sorted) };

    if (diffFromToday === 1) {
      expected = new Date(today);
      expected.setDate(expected.getDate() - 1);
    }

    for (const dateStr of sorted) {
      const d = new Date(dateStr);
      d.setHours(0, 0, 0, 0);
      const expectedStr = expected.toISOString().split('T')[0];
      const dateStrNorm = d.toISOString().split('T')[0];

      if (dateStrNorm === expectedStr) {
        streak++;
        expected.setDate(expected.getDate() - 1);
      } else {
        break;
      }
    }

    current = streak;
    longest = Math.max(current, this.calcLongest(sorted));
    return { current, longest };
  }

  private calcLongest(datesDesc: string[]): number {
    const asc = [...datesDesc].sort();
    let longest = 0;
    let streak = 1;
    for (let i = 1; i < asc.length; i++) {
      const prev = new Date(asc[i - 1]);
      const curr = new Date(asc[i]);
      const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        streak++;
        longest = Math.max(longest, streak);
      } else if (diff > 1) {
        streak = 1;
      }
    }
    return Math.max(longest, streak);
  }
}
