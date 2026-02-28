import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExportUserDataDto } from './dto/export-user-data.dto';
import { UserService } from './user.service';

@Controller('me')
export class MeController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('export')
  @ApiOperation({
    summary: 'Export my account data',
    description:
      'Returns the authenticated user profile with notes, projects, tags, and share links metadata.',
  })
  @ApiOkResponse({ type: ExportUserDataDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'User not found' })
  exportMyData(@Req() req: { user: { id: string } }) {
    return this.userService.exportUserData(req.user.id);
  }
}
