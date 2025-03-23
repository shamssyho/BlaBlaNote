import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get notes of logged-in user' })
  getMyNotes(@Req() req: any) {
    return this.noteService.getNotesByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a note for the logged-in user' })
  createNote(@Req() req: any, @Body() dto: CreateNoteDto) {
    return this.noteService.createNote(dto, req.user.id);
  }
}
