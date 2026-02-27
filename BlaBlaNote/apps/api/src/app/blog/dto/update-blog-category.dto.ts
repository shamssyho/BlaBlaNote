import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class UpdateBlogCategoryDto {
  @ApiProperty({ example: 'Knowledge Management' })
  @IsString()
  @MaxLength(120)
  name: string;
}
