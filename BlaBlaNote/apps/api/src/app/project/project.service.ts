import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async getProjects(userId: string, isAdmin: boolean, scope: 'mine' | 'all' = 'mine') {
    const where = isAdmin && scope === 'all' ? {} : { userId };

    const projects = await this.prisma.project.findMany({
      where,
      include: {
        _count: {
          select: { notes: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return projects.map((project) => ({
      id: project.id,
      name: project.name,
      notesCount: project._count.notes,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }));
  }

  async createProject(userId: string, dto: CreateProjectDto) {
    const project = await this.prisma.project.create({
      data: {
        userId,
        name: dto.name,
      },
      include: {
        _count: {
          select: { notes: true },
        },
      },
    });

    return {
      id: project.id,
      name: project.name,
      notesCount: project._count.notes,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }

  async renameProject(userId: string, id: string, dto: UpdateProjectDto) {
    await this.ensureProjectOwnership(id, userId);

    const project = await this.prisma.project.update({
      where: { id },
      data: { name: dto.name },
      include: {
        _count: {
          select: { notes: true },
        },
      },
    });

    return {
      id: project.id,
      name: project.name,
      notesCount: project._count.notes,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }

  async deleteProject(userId: string, id: string) {
    await this.ensureProjectOwnership(id, userId);

    await this.prisma.project.delete({ where: { id } });

    return { success: true };
  }

  async getProjectNotes(userId: string, id: string) {
    await this.ensureProjectOwnership(id, userId);

    const project = await this.prisma.project.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        notes: {
          where: { userId },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async ensureProjectOwnership(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('You cannot access this project');
    }

    return project;
  }
}
