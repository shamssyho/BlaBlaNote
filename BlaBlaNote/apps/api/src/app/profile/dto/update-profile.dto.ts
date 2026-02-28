import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'John' })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ example: 'en' })
  @IsString()
  @MaxLength(10)
  @IsOptional()
  language?: string;

  @ApiPropertyOptional({ example: 'dark', enum: ['light', 'dark'] })
  @IsIn(['light', 'dark'])
  @IsOptional()
  theme?: 'light' | 'dark';

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  notificationsEnabled?: boolean;
}
