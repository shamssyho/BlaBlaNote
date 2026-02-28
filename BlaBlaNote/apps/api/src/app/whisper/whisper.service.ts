import { Injectable, NotFoundException } from '@nestjs/common';
import { NoteStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import FormData = require('form-data');
import { DiscordService } from '../discord/discord.service';

const SUPPORTED_FORMATS = [
  '.flac',
  '.m4a',
  '.mp3',
  '.mp4',
  '.mpeg',
  '.mpga',
  '.oga',
  '.ogg',
  '.wav',
  '.webm',
];

@Injectable()
export class WhisperService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly discord: DiscordService
  ) {}

  private async transcribeFile(filePath: string) {
    const ext = path.extname(filePath).toLowerCase();

    if (!SUPPORTED_FORMATS.includes(ext)) {
      throw new Error(
        `Format de fichier non supporté (${filePath}). Formats acceptés: ${SUPPORTED_FORMATS.join(', ')}`
      );
    }

    const fileStream = fs.createReadStream(filePath);
    const formData = new FormData();
    formData.append('file', fileStream, path.basename(filePath));
    formData.append('model', 'whisper-1');

    const transcriptRes = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          ...formData.getHeaders(),
        },
      }
    );

    return transcriptRes.data.text as string;
  }

  private async summarizeTranscript(transcript: string) {
    const summaryRes = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Résume ce texte en quelques phrases.',
          },
          {
            role: 'user',
            content: transcript,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const translationRes = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Traduis ce texte en français.',
          },
          {
            role: 'user',
            content: transcript,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    return {
      summary: summaryRes.data.choices[0].message.content as string,
      translation: translationRes.data.choices[0].message.content as string,
    };
  }

  async processNoteAudio(noteId: string, userId: string, filePath: string) {
    const note = await this.prisma.note.findUnique({ where: { id: noteId } });

    if (!note || note.userId !== userId) {
      throw new NotFoundException('Note not found');
    }

    try {
      await this.prisma.note.update({
        where: { id: noteId },
        data: {
          status: NoteStatus.PROCESSING_TRANSLATION,
          errorMessage: null,
          audioUrl: filePath,
        },
      });

      const transcript = await this.transcribeFile(filePath);

      await this.prisma.note.update({
        where: { id: noteId },
        data: {
          text: transcript,
          transcriptText: transcript,
          status: NoteStatus.PROCESSING_SUMMARY,
          errorMessage: null,
        },
      });

      const { summary, translation } = await this.summarizeTranscript(transcript);

      const updatedNote = await this.prisma.note.update({
        where: { id: noteId },
        data: {
          summary,
          translation,
          status: NoteStatus.READY,
          errorMessage: null,
        },
      });

      const user = await this.prisma.user.findUnique({ where: { id: userId } });

      if (user) {
        await this.discord.sendWebhook({
          username: `${user.firstName} ${user.lastName}`,
          email: user.email,
          action: 'Transcription',
          date: new Date().toISOString(),
        });
      }

      return {
        success: true,
        transcript,
        summary,
        translation,
        noteId: updatedNote.id,
        status: updatedNote.status,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to transcribe or summarize audio';

      await this.prisma.note.update({
        where: { id: noteId },
        data: {
          status: NoteStatus.FAILED,
          errorMessage: message,
        },
      });

      throw new Error(message);
    }
  }

  async processNoteSummary(noteId: string, userId: string, transcript: string) {
    const note = await this.prisma.note.findUnique({ where: { id: noteId } });

    if (!note || note.userId !== userId) {
      throw new NotFoundException('Note not found');
    }

    try {
      await this.prisma.note.update({
        where: { id: noteId },
        data: {
          status: NoteStatus.PROCESSING_SUMMARY,
          errorMessage: null,
          text: transcript,
          transcriptText: transcript,
        },
      });

      const { summary, translation } = await this.summarizeTranscript(transcript);

      return this.prisma.note.update({
        where: { id: noteId },
        data: {
          summary,
          translation,
          status: NoteStatus.READY,
          errorMessage: null,
        },
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to summarize transcript';

      await this.prisma.note.update({
        where: { id: noteId },
        data: {
          status: NoteStatus.FAILED,
          errorMessage: message,
        },
      });

      throw new Error(message);
    }
  }

  async transcribeAudio(filePath: string, userId: string) {
    const note = await this.prisma.note.create({
      data: {
        userId,
        text: '',
        transcriptText: null,
        summary: null,
        translation: null,
        audioUrl: filePath,
        status: NoteStatus.UPLOADED,
        errorMessage: null,
      },
    });

    return this.processNoteAudio(note.id, userId, filePath);
  }
}
