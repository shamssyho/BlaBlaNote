import { ApiProperty } from '@nestjs/swagger';
import { BlogPostEntity } from './blog-post.entity';

export class PaginatedBlogPostsEntity {
  @ApiProperty({ type: [BlogPostEntity] })
  items: BlogPostEntity[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  pageSize: number;

  @ApiProperty({ example: 42 })
  total: number;
}
