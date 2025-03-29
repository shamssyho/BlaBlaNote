import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateNoteDto } from './dto/create-note.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Notes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notes for the current user' })
  @ApiResponse({ status: 200, description: 'List of notes' })
  async getMyNotes(@Req() req: Request) {
    const userId = req.user['sub'];
    return this.noteService.getNotesByUser(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new note manually' })
  @ApiResponse({ status: 201, description: 'Note created successfully' })
  async createNote(@Body() dto: CreateNoteDto, @Req() req: Request) {
    const userId = req.user['sub'];
    return this.noteService.createNote(dto, userId);
  }

  @Post(':id/share')
  @ApiOperation({ summary: 'Share a note via email or WhatsApp' })
  @ApiResponse({ status: 200, description: 'Note shared successfully' })
  async shareNote(
    @Param('id') id: string,
    @Body()
    body: { method: string; to: string; type: 'summary' | 'translation' }
  ) {
    const { method, to, type } = body;
    return this.noteService.shareNote(id, method, to, type);
  }
}
