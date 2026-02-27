import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BlogCategoryEntity } from './blog-category.entity';

export class BlogPostEntity {
  @ApiProperty({ example: 'cm123postid' })
  id: string;

  @ApiProperty({ example: 'How to Organize Your Notes Efficiently' })
  title: string;

  @ApiProperty({ example: 'how-to-organize-your-notes-efficiently' })
  slug: string;

  @ApiProperty({ example: 'A practical guide to structure and retrieve notes faster.' })
  excerpt: string;

  @ApiProperty({ example: 'Full blog content in markdown or plain text.' })
  content: string;

  @ApiPropertyOptional({ example: 'https://images.example.com/covers/note-guide.jpg' })
  coverImage: string | null;

  @ApiProperty({ example: true })
  published: boolean;

  @ApiProperty({ example: 'user-id' })
  authorId: string;

  @ApiPropertyOptional({ type: BlogCategoryEntity })
  category?: BlogCategoryEntity | null;

  @ApiProperty({ example: '2026-02-27T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-02-27T12:05:00.000Z' })
  updatedAt: Date;
}
