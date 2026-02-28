import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsHexColor, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ description: 'Tag name', example: 'Important', minLength: 1, maxLength: 60 })
  @IsString()
  @MinLength(1)
  @MaxLength(60)
  name: string;

  @ApiPropertyOptional({ description: 'Tag color in hex format', example: '#F59E0B' })
  @IsOptional()
  @IsString()
  @IsHexColor()
  color?: string;
}
