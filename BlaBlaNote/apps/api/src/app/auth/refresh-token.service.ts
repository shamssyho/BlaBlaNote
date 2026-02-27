import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly prisma: PrismaService) {}

  generateRawToken() {
    return crypto.randomBytes(48).toString('hex');
  }

  generateSessionId() {
    return crypto.randomUUID();
  }

  hashToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async createToken(params: {
    userId: string;
    rawToken: string;
    expiresAt: Date;
    rememberMe: boolean;
    sessionId: string;
    userAgent?: string;
    ipAddress?: string;
    replacedByTokenId?: string;
  }) {
    return this.prisma.refreshToken.create({
      data: {
        userId: params.userId,
        tokenHash: this.hashToken(params.rawToken),
        expiresAt: params.expiresAt,
        rememberMe: params.rememberMe,
        sessionId: params.sessionId,
        userAgent: params.userAgent,
        ipAddress: params.ipAddress,
        replacedByTokenId: params.replacedByTokenId,
      },
    });
  }

  async findActiveByRawToken(rawToken: string) {
    const tokenHash = this.hashToken(rawToken);

    return this.prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
  }

  async revokeToken(id: string) {
    return this.prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  async rotateToken(params: {
    currentTokenId: string;
    currentUserId: string;
    rememberMe: boolean;
    expiresAt: Date;
    sessionId: string;
    userAgent?: string;
    ipAddress?: string;
  }) {
    const newRawToken = this.generateRawToken();
    const newToken = await this.prisma.refreshToken.create({
      data: {
        userId: params.currentUserId,
        tokenHash: this.hashToken(newRawToken),
        expiresAt: params.expiresAt,
        rememberMe: params.rememberMe,
        sessionId: params.sessionId,
        userAgent: params.userAgent,
        ipAddress: params.ipAddress,
      },
    });

    await this.prisma.refreshToken.update({
      where: { id: params.currentTokenId },
      data: { revokedAt: new Date(), replacedByTokenId: newToken.id },
    });

    return { newRawToken, newToken };
  }
}
