import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { DiscordService } from '../discord/discord.service';
import { RegisterDto } from './dto/register.dto';
import { jwtConstants } from './auth.constants';
import { RefreshTokenService } from './refresh-token.service';
import { MailerService } from './mailer.service';

@Injectable()
export class AuthService {
  private readonly forgotPasswordByIp = new Map<
    string,
    { count: number; resetAt: number }
  >();
  private readonly forgotPasswordByEmail = new Map<
    string,
    { count: number; resetAt: number }
  >();
  private readonly loginAttemptsByIp = new Map<string, { count: number; resetAt: number }>();
  private readonly refreshAttemptsByIp = new Map<string, { count: number; resetAt: number }>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly discord: DiscordService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly mailerService: MailerService
  ) {}

  private generateAccessToken(user: {
    id: string;
    email: string;
    role: string;
  }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload, {
      expiresIn: jwtConstants.accessExpiresIn,
    });
  }

  private getRefreshExpiry(rememberMe: boolean) {
    const now = Date.now();
    if (rememberMe) {
      return new Date(
        now + jwtConstants.refreshExpiresInRememberMeDays * 24 * 60 * 60 * 1000
      );
    }

    return new Date(
      now + jwtConstants.refreshExpiresInSessionHours * 60 * 60 * 1000
    );
  }

  private hitRateLimit(
    key: string,
    limit: number,
    windowMs: number,
    map: Map<string, { count: number; resetAt: number }>
  ) {
    const now = Date.now();
    const current = map.get(key);

    if (!current || current.resetAt <= now) {
      map.set(key, { count: 1, resetAt: now + windowMs });
      return;
    }

    if (current.count >= limit) {
      throw new HttpException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    current.count += 1;
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) throw new ConflictException('Email already in use');
    if (!dto.termsAccepted) {
      throw new BadRequestException('Terms must be accepted');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        password: hashedPassword,
        termsAcceptedAt: new Date(),
        termsVersion: dto.termsVersion || 'v1.0',
      },
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      termsAcceptedAt: user.termsAcceptedAt,
      termsVersion: user.termsVersion,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid email or password');

    return user;
  }

  async login(params: {
    email: string;
    password: string;
    rememberMe?: boolean;
    ip?: string;
    userAgent?: string;
  }) {
    if (params.ip) {
      this.hitRateLimit(params.ip, 5, 60_000, this.loginAttemptsByIp);
    }

    const user = await this.validateUser(params.email, params.password);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const accessToken = this.generateAccessToken(user);
    const rawRefreshToken = this.refreshTokenService.generateRawToken();
    const rememberMe = params.rememberMe ?? false;
    const refreshExpiresAt = this.getRefreshExpiry(rememberMe);

    await this.refreshTokenService.createToken({
      userId: user.id,
      rawToken: rawRefreshToken,
      expiresAt: refreshExpiresAt,
      rememberMe,
      sessionId: this.refreshTokenService.generateSessionId(),
      ipAddress: params.ip,
      userAgent: params.userAgent,
    });

    await this.discord.sendWebhook({
      username: `${user.firstName} ${user.lastName}`,
      email: user.email,
      action: 'Connexion',
      date: new Date().toISOString(),
    });

    return {
      access_token: accessToken,
      refresh_token: rawRefreshToken,
      refresh_expires_at: refreshExpiresAt,
      rememberMe,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        termsAcceptedAt: user.termsAcceptedAt,
        termsVersion: user.termsVersion,
      },
    };
  }

  async refresh(params: {
    rawRefreshToken: string;
    ip?: string;
    userAgent?: string;
  }) {
    if (params.ip) {
      this.hitRateLimit(params.ip, 10, 60_000, this.refreshAttemptsByIp);
    }

    const existingToken = await this.refreshTokenService.findActiveByRawToken(
      params.rawRefreshToken
    );
    if (!existingToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: existingToken.userId },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const rotated = await this.refreshTokenService.rotateToken({
      currentTokenId: existingToken.id,
      currentUserId: existingToken.userId,
      rememberMe: existingToken.rememberMe,
      expiresAt: this.getRefreshExpiry(existingToken.rememberMe),
      sessionId: existingToken.sessionId,
      ipAddress: params.ip,
      userAgent: params.userAgent ?? existingToken.userAgent ?? undefined,
    });

    const accessToken = this.generateAccessToken(user);

    return {
      access_token: accessToken,
      refresh_token: rotated.newRawToken,
      refresh_expires_at: rotated.newToken.expiresAt,
    };
  }

  async logout(rawRefreshToken?: string) {
    if (!rawRefreshToken) {
      return { success: true };
    }

    const token = await this.refreshTokenService.findActiveByRawToken(
      rawRefreshToken
    );
    if (token) {
      await this.refreshTokenService.revokeToken(token.id);
    }

    return { success: true };
  }

  async forgotPassword(email: string, ip = 'unknown') {
    this.hitRateLimit(ip, 5, 60_000, this.forgotPasswordByIp);
    this.hitRateLimit(
      email.toLowerCase(),
      3,
      10 * 60_000,
      this.forgotPasswordByEmail
    );

    const genericResponse = {
      message:
        'If your account exists, you will receive a password reset link shortly.',
    };

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return genericResponse;
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');
    const expiresAt = new Date(
      Date.now() + jwtConstants.resetPasswordTokenMinutes * 60 * 1000
    );

    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    const frontendBase = process.env.FRONTEND_URL || 'http://localhost:4200';
    const resetLink = `${frontendBase}/reset-password?token=${rawToken}`;
    await this.mailerService.sendPasswordResetEmail(user.email, resetLink);

    return genericResponse;
  }

  async resetPassword(token: string, newPassword: string) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const resetToken = await this.prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!resetToken) {
      throw new BadRequestException('Invalid or expired token');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: passwordHash },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.refreshToken.updateMany({
        where: { userId: resetToken.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    return { success: true };
  }
}
