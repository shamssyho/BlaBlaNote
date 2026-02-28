import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn().mockResolvedValue(true),
}));

const prisma = {
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

const jwtService = {
  sign: jest.fn().mockReturnValue('access-token'),
} as unknown as JwtService;

const discord = {
  sendWebhook: jest.fn().mockResolvedValue(undefined),
};

const refreshTokenService = {
  generateRawToken: jest.fn().mockReturnValue('raw-refresh-token'),
  generateSessionId: jest.fn().mockReturnValue('session-id'),
  createToken: jest.fn().mockResolvedValue(undefined),
  findActiveByRawToken: jest.fn(),
  rotateToken: jest.fn(),
  revokeToken: jest.fn().mockResolvedValue(undefined),
};

const mailerService = {
  sendResetPasswordEmail: jest.fn().mockResolvedValue(undefined),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(
      prisma as never,
      jwtService,
      discord as never,
      refreshTokenService as never,
      mailerService as never
    );
  });

  it('login should return tokens and user', async () => {
    const user = {
      id: 'user-1',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'hashed',
      role: 'USER',
      termsAcceptedAt: new Date(),
      termsVersion: 'v1.0',
    };
    prisma.user.findUnique.mockResolvedValue(user);

    const result = await service.login({
      email: user.email,
      password: 'password123',
      rememberMe: true,
      ip: '127.0.0.1',
      userAgent: 'jest',
    });

    expect(result.access_token).toBe('access-token');
    expect(result.refresh_token).toBe('raw-refresh-token');
    expect(refreshTokenService.createToken).toHaveBeenCalled();
  });

  it('refresh should rotate token', async () => {
    refreshTokenService.findActiveByRawToken.mockResolvedValue({
      id: 'token-id',
      userId: 'user-1',
      rememberMe: false,
      sessionId: 'session-id',
      userAgent: 'jest',
    });
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'john@example.com',
      role: 'USER',
    });
    refreshTokenService.rotateToken.mockResolvedValue({
      newRawToken: 'new-refresh-token',
      newToken: { expiresAt: new Date('2030-01-01T00:00:00.000Z') },
    });

    const result = await service.refresh({ rawRefreshToken: 'refresh-token' });

    expect(result.access_token).toBe('access-token');
    expect(result.refresh_token).toBe('new-refresh-token');
  });

  it('logout should revoke token', async () => {
    refreshTokenService.findActiveByRawToken.mockResolvedValue({ id: 'token-id' });

    const result = await service.logout('refresh-token');

    expect(result.success).toBe(true);
    expect(refreshTokenService.revokeToken).toHaveBeenCalledWith('token-id');
  });

  it('refresh should throw on invalid token', async () => {
    refreshTokenService.findActiveByRawToken.mockResolvedValue(null);

    await expect(service.refresh({ rawRefreshToken: 'bad-token' })).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
