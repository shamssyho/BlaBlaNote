import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import FormData = require('form-data');

@Injectable()
export class WhisperService {
  async transcribeAudio(filePath: string) {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      throw new Error('❌ OpenAI API Key is missing in environment variables.');
    }

    // Vérifie que le fichier existe
    if (!fs.existsSync(filePath)) {
      throw new Error(`❌ Le fichier ${filePath} n'existe pas.`);
    }

    // 🔥 Nouvelle correction : Récupérer l'extension correctement
    const fileExtension = filePath.split('.').pop()?.toLowerCase();
    const allowedFormats = [
      'flac',
      'm4a',
      'mp3',
      'mp4',
      'mpeg',
      'mpga',
      'oga',
      'ogg',
      'wav',
      'webm',
    ];

    if (!fileExtension || !allowedFormats.includes(fileExtension)) {
      throw new Error(
        `❌ Format de fichier non supporté (${fileExtension}). Formats acceptés: ${allowedFormats.join(
          ', '
        )}`
      );
    }

    const fileStream = fs.createReadStream(filePath);

    const formData = new FormData();
    formData.append('file', fileStream, { filename: `audio.${fileExtension}` });
    formData.append('model', 'whisper-1');
    formData.append('language', 'fr');
    formData.append('temperature', '0.2');
    formData.append('response_format', 'text');

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/audio/transcriptions',
        formData,
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            ...formData.getHeaders(),
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        '❌ Erreur Whisper API:',
        error.response?.data || error.message
      );
      throw new Error('❌ Failed to transcribe audio');
    }
  }
}
