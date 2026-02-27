import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NoteService } from './note.service';
import { PublicSharedNoteDto } from './dto/public-shared-note.dto';

@ApiTags('Public Notes')
@Controller('public/notes')
export class PublicNoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get(':token')
  @ApiOperation({ summary: 'Get a shared note by public token' })
  @ApiResponse({
    status: 200,
    description: 'Shared note fetched successfully',
    type: PublicSharedNoteDto,
  })
  @ApiResponse({ status: 404, description: 'Share link not found' })
  async getSharedNote(@Param('token') token: string) {
    return this.noteService.getPublicNoteByToken(token);
  }
}
