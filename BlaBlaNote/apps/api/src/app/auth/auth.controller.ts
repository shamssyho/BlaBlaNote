import {
  Body,
  Controller,
  HttpCode,
  Ip,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { cookieConstants } from './auth.constants';

@ApiTags('Authentication')
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

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 409 })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401 })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const data = await this.authService.login(dto.email, dto.password, dto.rememberMe);

    res.cookie(
      cookieConstants.refreshTokenName,
      data.refresh_token,
      this.getRefreshCookieOptions(dto.rememberMe ? data.refresh_expires_at : undefined)
    );

    return {
      access_token: data.access_token,
      user: data.user,
    };
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = this.getCookie(req, cookieConstants.refreshTokenName);
    const data = await this.authService.refresh(refreshToken || '');

    res.cookie(
      cookieConstants.refreshTokenName,
      data.refresh_token,
      this.getRefreshCookieOptions(data.refresh_expires_at)
    );

    return { access_token: data.access_token };
  }

  @Post('logout')
  @HttpCode(200)
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
