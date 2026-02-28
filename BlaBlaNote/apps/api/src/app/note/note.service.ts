import { Injectable, NotFoundException } from '@nestjs/common';
import { NoteStatus, Prisma, ShareChannel, ShareContentType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { GetNotesQueryDto } from './dto/get-notes-query.dto';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';
import { Twilio } from 'twilio';
import { DiscordService } from '../discord/discord.service';
import { ProjectService } from '../project/project.service';
import { WhisperService } from '../whisper/whisper.service';
import * as crypto from 'crypto';
import { NotionService } from './notion.service';

@Injectable()
export class NoteService {
  private readonly client: Twilio;

  constructor(
    private readonly prisma: PrismaService,
    private readonly discord: DiscordService,
    private readonly projectService: ProjectService,
    private readonly whisperService: WhisperService,
    private readonly notionService: NotionService
  ) {
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    this.client = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  async getNotesByUser(userId: string, query: GetNotesQueryDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const where: Prisma.NoteWhereInput = {
      userId,
      ...(query.search
        ? {
            OR: [
              { text: { contains: query.search, mode: 'insensitive' } },
              { summary: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(query.projectId ? { projectId: query.projectId } : {}),
      ...(query.dateFrom || query.dateTo
        ? {
            createdAt: {
              ...(query.dateFrom ? { gte: new Date(query.dateFrom) } : {}),
              ...(query.dateTo ? { lte: new Date(query.dateTo) } : {}),
            },
          }
        : {}),
      ...(query.tagIds?.length
        ? {
            AND: query.tagIds.map((tagId) => ({
              noteTags: {
                some: {
                  tagId,
                  tag: { userId },
                },
              },
            })),
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.note.findMany({
        where,
        include: {
          project: true,
          noteTags: { include: { tag: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.note.count({ where }),
    ]);

    if (user) {
      await this.discord.sendWebhook({
        username: `${user.firstName} ${user.lastName}`,
        email: user.email,
        action: 'Consulted notes',
        date: new Date().toISOString(),
      });
    }

    return { items, page, pageSize, total };
  }

  async getNoteById(id: string, userId: string) {
    const note = await this.prisma.note.findFirst({
      where: { id, userId },
      include: { project: true, noteTags: { include: { tag: true } } },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  async createNote(dto: CreateNoteDto, userId: string) {
    const note = await this.prisma.note.create({
      data: {
        userId,
        text: dto.text ?? '',
        audioUrl: dto.audioUrl,
        status: dto.audioUrl ? NoteStatus.UPLOADED : NoteStatus.READY,
        errorMessage: null,
        transcriptText: dto.text ?? null,
      },
    });

    if (dto.audioUrl) {
      await this.whisperService.processNoteAudio(note.id, userId, dto.audioUrl);
    }

    return this.getNoteById(note.id, userId);
  }

  async summarizeNote(noteId: string, userId: string) {
    const note = await this.getNoteById(noteId, userId);
    const transcript = note.transcriptText || note.text;
    return this.whisperService.processNoteSummary(noteId, userId, transcript);
  }

  async translateNote(noteId: string, userId: string) {
    const note = await this.getNoteById(noteId, userId);
    const transcript = note.transcriptText || note.text;
    await this.prisma.note.update({
      where: { id: noteId },
      data: { status: NoteStatus.PROCESSING_TRANSLATION, errorMessage: null },
    });
    const translated = `${transcript}`;
    return this.prisma.note.update({
      where: { id: noteId },
      data: {
        translation: translated,
        status: note.summary ? NoteStatus.READY : NoteStatus.PROCESSING_SUMMARY,
      },
    });
  }

  async shareNote(
    noteId: string,
    userId: string,
    channel: ShareChannel,
    destination: string,
    contentType: ShareContentType,
    targetLanguage?: string
  ) {
    const note = await this.getNoteById(noteId, userId);
    const content = this.composeShareContent(note, contentType);

    if (channel === ShareChannel.EMAIL) {
      const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();
      await emailApi.sendTransacEmail({
        sender: { name: 'BlaBlaNote', email: 'noreply@blablanote.app' },
        to: [{ email: destination }],
        subject: 'Shared note from BlaBlaNote',
        textContent: content,
      });
    }

    if (channel === ShareChannel.WHATSAPP) {
      await this.client.messages.create({
        body: content,
        from: process.env.TWILIO_WHATSAPP_NUMBER,
        to: `whatsapp:${destination}`,
      });
    }

    if (channel === ShareChannel.NOTION) {
      await this.notionService.appendToPage(destination, content);
    }

    await this.prisma.shareHistory.create({
      data: {
        noteId,
        userId,
        channel,
        destination,
        contentType,
        targetLanguage,
      },
    });

    return { success: true };
  }

  private composeShareContent(
    note: { text: string; summary: string | null; translation: string | null },
    contentType: ShareContentType
  ) {
    if (contentType === ShareContentType.SUMMARY) return note.summary ?? '';
    if (contentType === ShareContentType.TRANSLATION) return note.translation ?? '';
    if (contentType === ShareContentType.BOTH)
      return `Summary:\n${note.summary ?? ''}\n\nTranslation:\n${note.translation ?? ''}`;
    return note.text;
  }

  async createShareLink(
    noteId: string,
    userId: string,
    expiresInHours: number,
    allowSummary: boolean,
    allowTranscript: boolean
  ) {
    const note = await this.prisma.note.findFirst({ where: { id: noteId, userId } });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    const rawToken = crypto.randomBytes(48).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

    await this.prisma.shareLink.create({
      data: { noteId, createdByUserId: userId, tokenHash, expiresAt, allowSummary, allowTranscript },
    });

    const baseUrl = process.env.APP_URL || 'http://localhost:3001';
    return { publicUrl: `${baseUrl}/public/notes/${rawToken}`, expiresAt };
  }

  async getPublicNoteByToken(rawToken: string) {
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const share = await this.prisma.shareLink.findFirst({
      where: { tokenHash, expiresAt: { gt: new Date() } },
      include: { note: { select: { id: true, summary: true, transcriptText: true } } },
    });

    if (!share) {
      throw new NotFoundException('Share link not found');
    }

    return {
      noteId: share.note.id,
      ...(share.allowSummary ? { summary: share.note.summary ?? '' } : {}),
      ...(share.allowTranscript ? { transcriptText: share.note.transcriptText ?? share.note.summary ?? '' } : {}),
    };
  }

  async getShareHistory(noteId: string, userId: string) {
    await this.getNoteById(noteId, userId);
    return this.prisma.shareLink.findMany({
      where: { noteId },
      select: { id: true, expiresAt: true, allowSummary: true, allowTranscript: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async revokeShareLink(shareId: string, userId: string) {
    const share = await this.prisma.shareLink.findFirst({
      where: { id: shareId, note: { userId } },
      select: { id: true },
    });

    if (!share) {
      throw new NotFoundException('Share link not found');
    }

    await this.prisma.shareLink.delete({ where: { id: shareId } });
    return { success: true };
  }

  async replaceNoteTags(noteId: string, userId: string, tagIds: string[]) {
    const note = await this.prisma.note.findUnique({ where: { id: noteId } });
    if (!note || note.userId !== userId) {
      throw new NotFoundException('Note not found');
    }

    const uniqueTagIds = [...new Set(tagIds)];
    if (uniqueTagIds.length > 0) {
      const tags = await this.prisma.tag.findMany({ where: { id: { in: uniqueTagIds } }, select: { id: true, userId: true } });
      if (tags.length !== uniqueTagIds.length || tags.some((tag) => tag.userId !== userId)) {
        throw new NotFoundException('Tag not found');
      }
    }

    await this.prisma.noteTag.deleteMany({ where: { noteId } });
    if (uniqueTagIds.length > 0) {
      await this.prisma.noteTag.createMany({ data: uniqueTagIds.map((tagId) => ({ noteId, tagId })) });
    }

    return this.getNoteById(noteId, userId);
  }

  async updateNoteProject(noteId: string, userId: string, projectId: string | null) {
    const note = await this.prisma.note.findUnique({ where: { id: noteId } });
    if (!note || note.userId !== userId) {
      throw new NotFoundException('Note not found');
    }

    if (projectId) {
      await this.projectService.ensureProjectOwnership(projectId, userId);
    }

    return this.prisma.note.update({ where: { id: noteId }, data: { projectId } });
  }
}
