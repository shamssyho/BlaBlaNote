import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Get,
  Patch,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteProjectDto } from './dto/update-note-project.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

type AuthUser = {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
};

@ApiTags('Notes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notes for the current user' })
  @ApiResponse({ status: 200, description: 'List of notes' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyNotes(@Req() req: Request) {
    const user = req.user as AuthUser;
    return this.noteService.getNotesByUser(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new note manually' })
  @ApiResponse({ status: 201, description: 'Note created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createNote(@Body() dto: CreateNoteDto, @Req() req: Request) {
    const user = req.user as AuthUser;
    return this.noteService.createNote(dto, user.id);
  }

  @Patch(':id/project')
  @ApiOperation({ summary: 'Attach note to a project or remove it' })
  @ApiResponse({ status: 200, description: 'Note project updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Note or project not found' })
  async updateNoteProject(
    @Param('id') id: string,
    @Body() dto: UpdateNoteProjectDto,
    @Req() req: Request
  ) {
    const user = req.user as AuthUser;
    return this.noteService.updateNoteProject(id, user.id, dto.projectId ?? null);
  }

  @Post(':id/share')
  @ApiOperation({ summary: 'Share a note via email or WhatsApp' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        method: { type: 'string', example: 'email' },
        to: { type: 'string', example: 'recipient@example.com' },
        type: {
          type: 'string',
          enum: ['summary', 'translation'],
          example: 'summary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Note shared successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async shareNote(
    @Param('id') id: string,
    @Body()
    body: { method: string; to: string; type: 'summary' | 'translation' }
  ) {
    const { method, to, type } = body;
    return this.noteService.shareNote(id, method, to, type);
  }
}