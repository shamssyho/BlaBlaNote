import {
  Body,
  Controller,
  HttpCode,
  Ip,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { cookieConstants } from './auth.constants';
import {
  ErrorResponseDto,
  LoginTokenResponseDto,
  LogoutResponseDto,
  RefreshTokenResponseDto,
} from './dto/auth-token-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private getRefreshCookieOptions(expiresAt?: Date) {
    const isProduction = process.env.NODE_ENV === 'production';

    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ('none' as const) : ('lax' as const),
      path: '/auth',
      ...(expiresAt ? { expires: expiresAt } : {}),
    };
  }

  private getCookie(req: Request, name: string) {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) return undefined;

    const cookies = cookieHeader.split(';').map((item) => item.trim());
    const match = cookies.find((item) => item.startsWith(`${name}=`));
    if (!match) return undefined;

    return decodeURIComponent(match.slice(name.length + 1));
  }

  private getUserAgent(req: Request) {
    const header = req.headers['user-agent'];
    if (Array.isArray(header)) {
      return header[0];
    }

    return header;
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 409 })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, type: LoginTokenResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiTooManyRequestsResponse({ type: ErrorResponseDto })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const data = await this.authService.login({
      email: dto.email,
      password: dto.password,
      rememberMe: dto.rememberMe,
      ip,
      userAgent: this.getUserAgent(req),
    });

    res.cookie(
      cookieConstants.refreshTokenName,
      data.refresh_token,
      this.getRefreshCookieOptions(dto.rememberMe ? data.refresh_expires_at : undefined)
    );

    return data;
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Refresh access and refresh tokens' })
  @ApiResponse({ status: 200, type: RefreshTokenResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiTooManyRequestsResponse({ type: ErrorResponseDto })
  async refresh(
    @Req() req: Request,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const refreshToken = this.getCookie(req, cookieConstants.refreshTokenName);
    const data = await this.authService.refresh({
      rawRefreshToken: refreshToken || '',
      ip,
      userAgent: this.getUserAgent(req),
    });

    res.cookie(
      cookieConstants.refreshTokenName,
      data.refresh_token,
      this.getRefreshCookieOptions(data.refresh_expires_at)
    );

    return data;
  }

  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Logout and revoke refresh token' })
  @ApiResponse({ status: 200, type: LogoutResponseDto })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = this.getCookie(req, cookieConstants.refreshTokenName);
    await this.authService.logout(refreshToken);

    res.clearCookie(cookieConstants.refreshTokenName, this.getRefreshCookieOptions());

    return { success: true };
  }

  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
    @Ip() ip: string
  ) {
    return this.authService.forgotPassword(dto.email, ip);
  }

  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }
}
