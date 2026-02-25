import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LogoutDto {
  @ApiProperty({ example: 'refresh_token_value' })
  @IsString()
  @MinLength(10)
  refreshToken!: string;
}