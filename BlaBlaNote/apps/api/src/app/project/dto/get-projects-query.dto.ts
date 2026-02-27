import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

enum ProjectsScope {
  mine = 'mine',
  all = 'all',
}

export class GetProjectsQueryDto {
  @ApiPropertyOptional({ enum: ProjectsScope, default: ProjectsScope.mine })
  @IsOptional()
  @IsEnum(ProjectsScope)
  scope?: ProjectsScope = ProjectsScope.mine;
}

export { ProjectsScope };
