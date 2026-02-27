import { Controller, Delete, Param, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NoteService } from './note.service';

type AuthUser = {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
};

@ApiTags('Shares')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('shares')
export class ShareController {
  constructor(private readonly noteService: NoteService) {}

  @Delete(':id')
  @ApiOperation({ summary: 'Revoke a share link' })
  @ApiResponse({ status: 200, description: 'Share link revoked successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Share link not found' })
  async revokeShareLink(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as AuthUser;
    return this.noteService.revokeShareLink(id, user.id);
  }
}
