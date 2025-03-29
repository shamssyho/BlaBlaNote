import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';

@Injectable()
export class NoteService {
  private apiInstance: SibApiV3Sdk.TransactionalEmailsApi;

  constructor(private readonly prisma: PrismaService) {
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;
  }

  async getNotesByUser(userId: string) {
    return this.prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createNote(dto: CreateNoteDto, userId: string) {
    return this.prisma.note.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async shareNote(id: string, method: string, to: string, type: string) {
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note) throw new NotFoundException('Note not found');

    const body = `
    🔹 Summary:
    ${note.summary}
    
    📝 Full Transcription:
    ${note.text}
    `;
    if (!body) {
      throw new NotFoundException(`${type} not available for this note`);
    }

    if (method === 'email') {
      const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

      await emailApi.sendTransacEmail({
        sender: { name: 'BlaBla Note', email: 'shamss12301230@gmail.com' },
        to: [{ email: to }],
        subject: `Your ${type} from BlaBlaNote`,
        textContent: body,
      });

      return { success: true, method: 'email', to };
    }

    if (method === 'whatsapp') {
      return { success: true, method: 'whatsapp', to, message: body };
    }

    return { success: false, message: 'Unsupported method' };
  }
}
