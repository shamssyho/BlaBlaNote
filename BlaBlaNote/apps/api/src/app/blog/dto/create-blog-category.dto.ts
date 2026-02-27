import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateBlogCategoryDto {
  @ApiProperty({ example: 'Productivity' })
  @IsString()
  @MaxLength(120)
  name: string;
}
