import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'current-password' })
  @IsString()
  currentPassword!: string;

  @ApiProperty({ example: 'new-password-123' })
  @IsString()
  @MinLength(8)
  newPassword!: string;
}
