import { ApiProperty } from '@nestjs/swagger';

class AuthUserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty({ enum: ['ADMIN', 'USER'] })
  role!: 'ADMIN' | 'USER';

  @ApiProperty({ nullable: true })
  termsAcceptedAt!: Date | null;

  @ApiProperty({ nullable: true })
  termsVersion!: string | null;
}

export class LoginTokenResponseDto {
  @ApiProperty()
  access_token!: string;

  @ApiProperty()
  refresh_token!: string;

  @ApiProperty()
  refresh_expires_at!: Date;

  @ApiProperty({ type: AuthUserDto })
  user!: AuthUserDto;
}

export class RefreshTokenResponseDto {
  @ApiProperty()
  access_token!: string;

  @ApiProperty()
  refresh_token!: string;

  @ApiProperty()
  refresh_expires_at!: Date;
}

export class LogoutResponseDto {
  @ApiProperty()
  success!: boolean;
}

export class ErrorResponseDto {
  @ApiProperty()
  statusCode!: number;

  @ApiProperty()
  message!: string;

  @ApiProperty()
  error!: string;
}
