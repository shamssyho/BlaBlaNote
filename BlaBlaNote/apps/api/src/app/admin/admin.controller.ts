import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AdminService } from './admin.service';
import { GetAdminJobsQueryDto } from './dto/get-admin-jobs-query.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get admin dashboard stats' })
  @ApiResponse({ status: 200, description: 'Dashboard stats' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  getStats() {
    return this.adminService.getStats();
  }

  @Get('jobs')
  @ApiOperation({ summary: 'Get jobs queue notes by status' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated jobs list' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  getJobs(@Query() query: GetAdminJobsQueryDto) {
    return this.adminService.getJobs(query);
  }
}
