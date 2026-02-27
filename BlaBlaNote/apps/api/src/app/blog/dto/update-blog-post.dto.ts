import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateBlogPostDto {
  @ApiPropertyOptional({ example: 'How to Organize Team Notes Efficiently' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({ example: 'Updated excerpt focused on collaboration.' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  excerpt?: string;

  @ApiPropertyOptional({ example: 'Updated full blog content.' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ example: 'https://images.example.com/covers/new-cover.jpg' })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @ApiPropertyOptional({ example: 'cm123categoryid' })
  @IsOptional()
  @IsString()
  categoryId?: string;
}
