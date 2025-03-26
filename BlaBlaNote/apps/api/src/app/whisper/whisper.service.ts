import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';
import * as fs from 'fs';
import FormData = require('form-data');
import * as path from 'path';

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
  constructor(private readonly prisma: PrismaService) {}

  async transcribeAudio(filePath: string, userId: string) {
    const ext = path.extname(filePath).toLowerCase();
    if (!SUPPORTED_FORMATS.includes(ext)) {
      throw new Error(
        `❌ Format de fichier non supporté (${filePath}). Formats acceptés: ${SUPPORTED_FORMATS.join(
          ', '
        )}`
      );
    }

    const fileStream = fs.createReadStream(filePath);
    const formData = new FormData();
    formData.append('file', fileStream, path.basename(filePath));
    formData.append('model', 'whisper-1');

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/audio/transcriptions',
        formData,
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            ...formData.getHeaders(),
          },
        }
      );

      const transcript = response.data.text;
      await this.prisma.note.create({
        data: {
          userId,
          text: transcript,
          audioUrl: filePath,
        },
      });

      return { success: true, transcript };
    } catch (error) {
      console.error(
        '❌ Erreur Whisper API:',
        error.response?.data || error.message
      );
      throw new Error('❌ Failed to transcribe audio');
    }
  }
}
