import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ description: 'Tag name', example: 'Important' })
  @IsString()
  @MinLength(1)
  name: string;
}
