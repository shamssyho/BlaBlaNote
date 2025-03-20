import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { WhisperService } from './whisper.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Express } from 'express';
import { Multer } from 'multer';

@ApiTags('Whisper')
@Controller('whisper')
export class WhisperController {
  constructor(private readonly whisperService: WhisperService) {}

  @Post('transcribe')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Transcribe an audio file to text' })
  @ApiResponse({ status: 200, description: 'Transcription successful' })
  @ApiResponse({ status: 400, description: 'Invalid file' })
  async transcribe(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('❌ Aucun fichier reçu.');
    }
    return this.whisperService.transcribeAudio(file.path);
  }
}
