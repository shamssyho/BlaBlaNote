import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User first name' })
  @IsString()
  firstName!: string;

  @ApiProperty({ description: 'User last name' })
  @IsString()
  lastName!: string;

  @ApiProperty({ description: 'User email address' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'User password (minimum 6 characters)' })
  @IsString()
  @MinLength(6)
  password!: string;
}
