import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectService } from './project.service';

type AuthUser = {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
};

@ApiTags('Projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @ApiOperation({ summary: 'List current user projects' })
  @ApiResponse({ status: 200, description: 'Projects list' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProjects(@Req() req: Request) {
    const user = req.user as AuthUser;
    return this.projectService.getProjects(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createProject(@Req() req: Request, @Body() dto: CreateProjectDto) {
    const user = req.user as AuthUser;
    return this.projectService.createProject(user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Rename a project' })
  @ApiResponse({ status: 200, description: 'Project renamed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  renameProject(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateProjectDto) {
    const user = req.user as AuthUser;
    return this.projectService.renameProject(user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  deleteProject(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as AuthUser;
    return this.projectService.deleteProject(user.id, id);
  }
}
