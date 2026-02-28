import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ProjectService } from './project.service';

describe('ProjectService', () => {
  const prisma = {
    project: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  let service: ProjectService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProjectService(prisma as never);
  });

  it('creates and lists projects', async () => {
    prisma.project.create.mockResolvedValue({
      id: 'project-1',
      name: 'Inbox',
      createdAt: new Date(),
      updatedAt: new Date(),
      _count: { notes: 0 },
    });
    prisma.project.findMany.mockResolvedValue([
      {
        id: 'project-1',
        name: 'Inbox',
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { notes: 2 },
      },
    ]);

    const created = await service.createProject('user-1', { name: 'Inbox' });
    const projects = await service.getProjects('user-1');

    expect(created.name).toBe('Inbox');
    expect(projects[0].notesCount).toBe(2);
  });

  it('rename and delete enforce ownership', async () => {
    prisma.project.findUnique.mockResolvedValue({ id: 'project-1', userId: 'user-1' });
    prisma.project.update.mockResolvedValue({
      id: 'project-1',
      name: 'Renamed',
      createdAt: new Date(),
      updatedAt: new Date(),
      _count: { notes: 1 },
    });

    const renamed = await service.renameProject('user-1', 'project-1', { name: 'Renamed' });
    const deleted = await service.deleteProject('user-1', 'project-1');

    expect(renamed.name).toBe('Renamed');
    expect(deleted.success).toBe(true);
  });

  it('ensureProjectOwnership throws when project missing', async () => {
    prisma.project.findUnique.mockResolvedValue(null);

    await expect(service.ensureProjectOwnership('project-1', 'user-1')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('ensureProjectOwnership throws when project belongs to another user', async () => {
    prisma.project.findUnique.mockResolvedValue({ id: 'project-1', userId: 'user-2' });

    await expect(service.ensureProjectOwnership('project-1', 'user-1')).rejects.toBeInstanceOf(ForbiddenException);
  });
});
