import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

const ALLOWED_SORT_FIELDS = [
  'createdAt',
  'lastLoginAt',
  'email',
  'price',
  'notesCount',
] as const;

export type AdminUsersSortField = (typeof ALLOWED_SORT_FIELDS)[number];

function parseNumber(value: unknown, defaultValue: number) {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : value;
}

function parseBoolean(value: unknown) {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }

  return value;
}

function parseStatusArray(value: unknown) {
  if (!value) return undefined;

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return value;
}

export class GetAdminUsersQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @Transform(({ value }) => parseNumber(value, 1))
  @IsInt()
  @Min(1)
  @IsOptional()
  page = 1;

  @ApiPropertyOptional({ default: 20, maximum: 100 })
  @Transform(({ value }) => parseNumber(value, 20))
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  pageSize = 20;

  @ApiPropertyOptional({ description: 'Search by firstName, lastName or email' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    enum: ['ACTIVE', 'SUSPENDED', 'PENDING', 'DELETED'],
    isArray: true,
  })
  @Transform(({ value }) => parseStatusArray(value))
  @IsArray()
  @IsEnum(['ACTIVE', 'SUSPENDED', 'PENDING', 'DELETED'], { each: true })
  @IsOptional()
  status?: Array<'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'DELETED'>;

  @ApiPropertyOptional({ enum: ['ADMIN', 'USER'] })
  @IsEnum(['ADMIN', 'USER'])
  @IsOptional()
  role?: 'ADMIN' | 'USER';

  @ApiPropertyOptional()
  @Transform(({ value }) => parseBoolean(value))
  @IsBoolean()
  @IsOptional()
  hasActiveRefreshTokens?: boolean;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  createdFrom?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  createdTo?: string;

  @ApiPropertyOptional({ enum: ALLOWED_SORT_FIELDS, default: 'createdAt' })
  @IsIn(ALLOWED_SORT_FIELDS)
  @IsOptional()
  sortBy: AdminUsersSortField = 'createdAt';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsEnum(['asc', 'desc'])
  @IsOptional()
  sortDir: 'asc' | 'desc' = 'desc';
}
