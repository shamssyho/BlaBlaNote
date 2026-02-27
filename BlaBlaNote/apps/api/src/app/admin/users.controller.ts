import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
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
import { GetAdminUsersQueryDto } from './dto/get-admin-users-query.dto';
import { AdminUsersService } from './users.service';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get paginated users list (Admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'status',
    required: false,
    isArray: true,
    enum: ['ACTIVE', 'SUSPENDED', 'PENDING', 'DELETED'],
  })
  @ApiQuery({ name: 'role', required: false, enum: ['ADMIN', 'USER'] })
  @ApiQuery({ name: 'hasActiveRefreshTokens', required: false, type: Boolean })
  @ApiQuery({ name: 'createdFrom', required: false, type: String })
  @ApiQuery({ name: 'createdTo', required: false, type: String })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['createdAt', 'lastLoginAt', 'email', 'price', 'notesCount'],
  })
  @ApiQuery({ name: 'sortDir', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({
    status: 200,
    description: 'Paginated users list with safe token metadata',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  getUsers(@Query() query: GetAdminUsersQueryDto) {
    return this.adminUsersService.getUsers(query);
  }

  @Patch(':id/block')
  @ApiOperation({ summary: 'Toggle user blocked status (Admin only)' })
  @ApiResponse({ status: 200, description: 'User blocked status updated' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'User not found' })
  toggleBlock(@Param('id') id: string) {
    return this.adminUsersService.toggleBlock(id);
  }
}
