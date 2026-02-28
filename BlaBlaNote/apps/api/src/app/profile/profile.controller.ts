import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated profile' })
  @ApiOkResponse({ type: ProfileResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  getMe(@Req() req: { user: { id: string } }) {
    return this.profileService.getMe(req.user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current authenticated profile' })
  @ApiOkResponse({ type: ProfileResponseDto })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  updateMe(@Req() req: { user: { id: string } }, @Body() dto: UpdateProfileDto) {
    return this.profileService.updateMe(req.user.id, dto);
  }

  @Patch('me/password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Change current authenticated password' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Current password invalid or validation failed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  changePassword(@Req() req: { user: { id: string } }, @Body() dto: ChangePasswordDto) {
    return this.profileService.changePassword(req.user.id, dto);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Delete current authenticated account' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Account deleted successfully' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  deleteMe(@Req() req: { user: { id: string } }) {
    return this.profileService.deleteMe(req.user.id);
  }

  @Post('me/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    })
  )
  @ApiOperation({ summary: 'Upload profile avatar' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['avatar'],
    },
  })
  @ApiOkResponse({ type: ProfileResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid file or bad request' })
  uploadAvatar(
    @Req() req: { user: { id: string } },
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.profileService.uploadAvatar(req.user.id, file);
  }
}
