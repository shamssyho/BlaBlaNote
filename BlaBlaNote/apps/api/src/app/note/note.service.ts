import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NoteService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return `This action returns all note`;
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
}
