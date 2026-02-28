import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsHexColor, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Project name',
    example: 'Client calls',
    minLength: 1,
    maxLength: 120,
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(120)
  name: string;

  @ApiProperty({ description: 'Project color in hex format', example: '#2563EB' })
  @IsString()
  @IsHexColor()
  color: string;
}
