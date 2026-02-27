import { ApiProperty } from '@nestjs/swagger';

export class BlogCategoryEntity {
  @ApiProperty({ example: 'cm123categoryid' })
  id: string;

  @ApiProperty({ example: 'Productivity' })
  name: string;

  @ApiProperty({ example: 'productivity' })
  slug: string;

  @ApiProperty({ example: '2026-02-27T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-02-27T12:05:00.000Z' })
  updatedAt: Date;
}
