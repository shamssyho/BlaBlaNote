import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

type AuthUser = {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
};

@ApiTags('Tags')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @ApiOperation({ summary: 'List current user tags' })
  @ApiResponse({ status: 200, description: 'Tags list' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getTags(@Req() req: Request) {
    const user = req.user as AuthUser;
    return this.tagService.getTags(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a tag' })
  @ApiResponse({ status: 201, description: 'Tag created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createTag(@Req() req: Request, @Body() dto: CreateTagDto) {
    const user = req.user as AuthUser;
    return this.tagService.createTag(user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Rename a tag' })
  @ApiResponse({ status: 200, description: 'Tag renamed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  updateTag(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateTagDto
  ) {
    const user = req.user as AuthUser;
    return this.tagService.updateTag(user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tag' })
  @ApiResponse({ status: 200, description: 'Tag deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  deleteTag(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as AuthUser;
    return this.tagService.deleteTag(user.id, id);
  }
}
