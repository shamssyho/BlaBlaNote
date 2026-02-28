import { NotFoundException } from '@nestjs/common';
import { NoteService } from './note.service';

const sendTransacEmail = jest.fn().mockResolvedValue(undefined);
const createMessage = jest.fn().mockResolvedValue(undefined);

jest.mock('sib-api-v3-sdk', () => ({
  ApiClient: {
    instance: {
      authentications: {
        'api-key': {},
      },
    },
  },
  TransactionalEmailsApi: jest.fn().mockImplementation(() => ({ sendTransacEmail })),
}));

jest.mock('twilio', () => ({
  Twilio: jest.fn().mockImplementation(() => ({
    messages: {
      create: createMessage,
    },
  })),
}));

describe('NoteService', () => {
  const prisma = {
    user: { findUnique: jest.fn() },
    note: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const discord = { sendWebhook: jest.fn().mockResolvedValue(undefined) };
  const projectService = { ensureProjectOwnership: jest.fn().mockResolvedValue(undefined) };
  const whisperService = { processNoteAudio: jest.fn().mockResolvedValue(undefined) };

  let service: NoteService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new NoteService(
      prisma as never,
      discord as never,
      projectService as never,
      whisperService as never
    );
  });

  it('getNotesByUser returns paginated notes', async () => {
    prisma.user.findUnique.mockResolvedValue({ firstName: 'John', lastName: 'Doe', email: 'john@example.com' });
    prisma.$transaction.mockResolvedValue([[{ id: 'note-1' }], 1]);

    const result = await service.getNotesByUser('user-1', { page: 1, pageSize: 10 });

    expect(result.total).toBe(1);
    expect(result.items).toHaveLength(1);
  });

  it('createNote should create and return note', async () => {
    prisma.user.findUnique.mockResolvedValue({ firstName: 'John', lastName: 'Doe', email: 'john@example.com' });
    prisma.note.create.mockResolvedValue({ id: 'note-1' });
    prisma.note.findFirst.mockResolvedValue({ id: 'note-1' });

    const result = await service.createNote({ text: 'hello' }, 'user-1');

    expect(result.id).toBe('note-1');
    expect(whisperService.processNoteAudio).not.toHaveBeenCalled();
  });

  it('updateNoteProject should verify ownership', async () => {
    prisma.note.findUnique.mockResolvedValue({ id: 'note-1', userId: 'user-1' });
    prisma.note.update.mockResolvedValue({ id: 'note-1', projectId: 'project-1' });

    const result = await service.updateNoteProject('note-1', 'user-1', 'project-1');

    expect(projectService.ensureProjectOwnership).toHaveBeenCalledWith('project-1', 'user-1');
    expect(result.projectId).toBe('project-1');
  });

  it('shareNote should support email and whatsapp', async () => {
    prisma.note.findUnique.mockResolvedValue({ id: 'note-1', userId: 'user-1', summary: 'sum', text: 'text' });
    prisma.user.findUnique.mockResolvedValue({ firstName: 'John', lastName: 'Doe', email: 'john@example.com' });

    const emailResult = await service.shareNote('note-1', 'email', 'x@example.com', 'summary');
    const whatsappResult = await service.shareNote('note-1', 'whatsapp', '+15550001111', 'summary');

    expect(emailResult.success).toBe(true);
    expect(whatsappResult.success).toBe(true);
    expect(sendTransacEmail).toHaveBeenCalled();
    expect(createMessage).toHaveBeenCalled();
  });

  it('shareNote throws when note missing', async () => {
    prisma.note.findUnique.mockResolvedValue(null);

    await expect(service.shareNote('missing', 'email', 'x@example.com', 'summary')).rejects.toBeInstanceOf(NotFoundException);
  });
});
