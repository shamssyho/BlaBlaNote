import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'raw_reset_token' })
  @IsString()
  @MinLength(20)
  token!: string;

  @ApiProperty({ example: 'Str0ngPass!word' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Password must contain letters and numbers',
  })
  newPassword!: string;
}
