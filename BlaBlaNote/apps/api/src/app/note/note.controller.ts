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
import {
  ApiBearerAuth,
  ApiBody,
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
  @ApiQuery({
    name: 'tagIds',
    required: false,
    type: [String],
    description: 'Filter notes that contain all provided tags',
    isArray: true,
  })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Paginated notes list',
    type: GetNotesResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyNotes(@Req() req: Request, @Query() query: GetNotesQueryDto) {
    const user = req.user as AuthUser;
    return this.noteService.getNotesByUser(user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one note with processing status details' })
  @ApiResponse({ status: 200, description: 'Note fetched successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  async getNoteById(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as AuthUser;
    return this.noteService.getNoteById(id, user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new note manually' })
  @ApiResponse({ status: 201, description: 'Note created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createNote(@Body() dto: CreateNoteDto, @Req() req: Request) {
    const user = req.user as AuthUser;
    return this.noteService.createNote(dto, user.id);
  }

  @Post(':id/retry')
  @ApiOperation({ summary: 'Retry transcription or summarization for a note' })
  @ApiResponse({
    status: 200,
    description: 'Note processing retried successfully',
    type: NoteProcessingStatusDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  async retryNote(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as AuthUser;
    return this.noteService.retryProcessing(id, user.id);
  }

  @Patch(':id/project')
  @ApiOperation({ summary: 'Attach note to a project or remove it' })
  @ApiResponse({
    status: 200,
    description: 'Note project updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Note or project not found' })
  async updateNoteProject(
    @Param('id') id: string,
    @Body() dto: UpdateNoteProjectDto,
    @Req() req: Request
  ) {
    const user = req.user as AuthUser;
    return this.noteService.updateNoteProject(
      id,
      user.id,
      dto.projectId ?? null
    );
  }

  @Put(':id/tags')
  @ApiOperation({ summary: 'Replace tags of a note' })
  @ApiResponse({ status: 200, description: 'Note tags replaced successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Note or tag not found' })
  async replaceNoteTags(
    @Param('id') id: string,
    @Body() dto: ReplaceNoteTagsDto,
    @Req() req: Request
  ) {
    const user = req.user as AuthUser;
    return this.noteService.replaceNoteTags(id, user.id, dto.tagIds);
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
