import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Get,
  Patch,
  Put,
  Query,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteProjectDto } from './dto/update-note-project.dto';
import { ReplaceNoteTagsDto } from './dto/replace-note-tags.dto';
import { GetNotesQueryDto } from './dto/get-notes-query.dto';
import { GetNotesResponseDto } from './dto/get-notes-response.dto';
import { NoteProcessingStatusDto } from './dto/note-processing-status.dto';
import { CreateShareLinkDto } from './dto/create-share-link.dto';
import { CreateShareLinkResponseDto } from './dto/create-share-link-response.dto';
import { ShareHistoryItemDto } from './dto/share-history-item.dto';
import { ShareNoteDto } from './dto/share-note.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
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
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 20 })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'projectId', required: false, type: String })
  @ApiQuery({ name: 'tagIds', required: false, type: [String], isArray: true })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Paginated notes list', type: GetNotesResponseDto })
  async getMyNotes(@Req() req: Request, @Query() query: GetNotesQueryDto) {
    const user = req.user as AuthUser;
    return this.noteService.getNotesByUser(user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one note with processing status details' })
  async getNoteById(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as AuthUser;
    return this.noteService.getNoteById(id, user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new note manually' })
  async createNote(@Body() dto: CreateNoteDto, @Req() req: Request) {
    const user = req.user as AuthUser;
    return this.noteService.createNote(dto, user.id);
  }

  @Patch(':id/project')
  @ApiOperation({ summary: 'Attach note to a project or remove it' })
  async updateNoteProject(@Param('id') id: string, @Body() dto: UpdateNoteProjectDto, @Req() req: Request) {
    const user = req.user as AuthUser;
    return this.noteService.updateNoteProject(id, user.id, dto.projectId ?? null);
  }

  @Put(':id/tags')
  @ApiOperation({ summary: 'Replace tags of a note' })
  async replaceNoteTags(@Param('id') id: string, @Body() dto: ReplaceNoteTagsDto, @Req() req: Request) {
    const user = req.user as AuthUser;
    return this.noteService.replaceNoteTags(id, user.id, dto.tagIds);
  }

  @Post(':id/summarize')
  @ApiOperation({ summary: 'Trigger note summarization' })
  @ApiResponse({ status: 200, type: NoteProcessingStatusDto })
  async summarizeNote(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as AuthUser;
    return this.noteService.summarizeNote(id, user.id);
  }

  @Post(':id/translate')
  @ApiOperation({ summary: 'Trigger note translation' })
  @ApiResponse({ status: 200, type: NoteProcessingStatusDto })
  async translateNote(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as AuthUser;
    return this.noteService.translateNote(id, user.id);
  }

  @Post(':id/share')
  @ApiOperation({ summary: 'Share a note via email, WhatsApp, or Notion' })
  async shareNote(@Param('id') id: string, @Body() dto: ShareNoteDto, @Req() req: Request) {
    const user = req.user as AuthUser;
    return this.noteService.shareNote(id, user.id, dto.channel, dto.destination, dto.contentType, dto.targetLanguage);
  }

  @Post(':id/share-link')
  @ApiOperation({ summary: 'Create a public share link for a note' })
  @ApiResponse({ status: 201, type: CreateShareLinkResponseDto })
  async createShareLink(@Param('id') id: string, @Body() dto: CreateShareLinkDto, @Req() req: Request) {
    const user = req.user as AuthUser;
    return this.noteService.createShareLink(id, user.id, dto.expiresInHours, dto.allowSummary, dto.allowTranscript);
  }

  @Get(':id/shares')
  @ApiOperation({ summary: 'Get share link history for a note' })
  @ApiResponse({ status: 200, type: [ShareHistoryItemDto] })
  async getShareHistory(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as AuthUser;
    return this.noteService.getShareHistory(id, user.id);
  }
}
