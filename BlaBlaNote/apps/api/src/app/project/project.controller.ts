import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { GetProjectsQueryDto } from './dto/get-projects-query.dto';
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
  @ApiOperation({ summary: 'Get projects for the current user' })
  @ApiResponse({ status: 200, description: 'Projects list' })
  getProjects(@Req() req: Request, @Query() query: GetProjectsQueryDto) {
    const user = req.user as AuthUser;
    return this.projectService.getProjects(user.id, user.role === 'ADMIN', query.scope);
  }

  @Post()
  @ApiOperation({ summary: 'Create a project' })
  createProject(@Req() req: Request, @Body() dto: CreateProjectDto) {
    const user = req.user as AuthUser;
    return this.projectService.createProject(user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Rename a project' })
  renameProject(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateProjectDto) {
    const user = req.user as AuthUser;
    return this.projectService.renameProject(user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project' })
  deleteProject(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as AuthUser;
    return this.projectService.deleteProject(user.id, id);
  }

  @Get(':id/notes')
  @ApiOperation({ summary: 'Get notes in a project' })
  getProjectNotes(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as AuthUser;
    return this.projectService.getProjectNotes(user.id, id);
  }
}
