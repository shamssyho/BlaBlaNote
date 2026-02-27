import { Injectable } from '@nestjs/common';
import { NoteStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GetAdminJobsQueryDto } from './dto/get-admin-jobs-query.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - 6);

    const [notesCount, usersCount, sharesCount, failuresCount, notes, users, shares, failures] =
      await this.prisma.$transaction([
        this.prisma.note.count(),
        this.prisma.user.count(),
        this.prisma.shareLink.count(),
        this.prisma.note.count({ where: { status: NoteStatus.FAILED } }),
        this.prisma.note.findMany({
          where: { createdAt: { gte: start } },
          select: { createdAt: true },
        }),
        this.prisma.user.findMany({
          where: { createdAt: { gte: start } },
          select: { createdAt: true },
        }),
        this.prisma.shareLink.findMany({
          where: { createdAt: { gte: start } },
          select: { createdAt: true },
        }),
        this.prisma.note.findMany({
          where: { createdAt: { gte: start }, status: NoteStatus.FAILED },
          select: { createdAt: true },
        }),
      ]);

    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return {
        date: date.toISOString().slice(0, 10),
        notesCount: 0,
        usersCount: 0,
        sharesCount: 0,
        failuresCount: 0,
      };
    });

    const dayMap = new Map(days.map((day) => [day.date, day]));

    for (const item of notes) {
      const key = item.createdAt.toISOString().slice(0, 10);
      const day = dayMap.get(key);
      if (day) day.notesCount += 1;
    }

    for (const item of users) {
      const key = item.createdAt.toISOString().slice(0, 10);
      const day = dayMap.get(key);
      if (day) day.usersCount += 1;
    }

    for (const item of shares) {
      const key = item.createdAt.toISOString().slice(0, 10);
      const day = dayMap.get(key);
      if (day) day.sharesCount += 1;
    }

    for (const item of failures) {
      const key = item.createdAt.toISOString().slice(0, 10);
      const day = dayMap.get(key);
      if (day) day.failuresCount += 1;
    }

    return {
      notesCount,
      usersCount,
      sharesCount,
      failuresCount,
      last7Days: days,
    };
  }

  async getJobs(query: GetAdminJobsQueryDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const where = {
      status: {
        in: [NoteStatus.TRANSCRIBING, NoteStatus.SUMMARIZING, NoteStatus.FAILED],
      },
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.note.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          userId: true,
          status: true,
          errorMessage: true,
          createdAt: true,
          updatedAt: true,
          audioUrl: true,
        },
      }),
      this.prisma.note.count({ where }),
    ]);

    return {
      items,
      page,
      pageSize,
      total,
    };
  }
}
