import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateBlogPostDto {
  @ApiProperty({ example: 'How to Organize Your Notes Efficiently' })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'A practical guide to structure and retrieve notes faster.' })
  @IsString()
  @MaxLength(300)
  excerpt: string;

  @ApiProperty({ example: 'Full blog content in markdown or plain text.' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ example: 'https://images.example.com/covers/note-guide.jpg' })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @ApiPropertyOptional({ example: 'cm123categoryid' })
  @IsOptional()
  @IsString()
  categoryId?: string;
}
