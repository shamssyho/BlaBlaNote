import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, UserStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GetAdminUsersQueryDto } from './dto/get-admin-users-query.dto';

@Injectable()
export class AdminUsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers(query: GetAdminUsersQueryDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;
    const now = new Date();

    const where: Prisma.UserWhereInput = {
      ...(query.search
        ? {
            OR: [
              {
                email: {
                  contains: query.search,
                  mode: 'insensitive',
                },
              },
              {
                firstName: {
                  contains: query.search,
                  mode: 'insensitive',
                },
              },
              {
                lastName: {
                  contains: query.search,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}),
      ...(query.status?.length ? { status: { in: query.status } } : {}),
      ...(query.role ? { role: query.role } : {}),
      ...(query.createdFrom || query.createdTo
        ? {
            createdAt: {
              ...(query.createdFrom ? { gte: new Date(query.createdFrom) } : {}),
              ...(query.createdTo ? { lte: new Date(query.createdTo) } : {}),
            },
          }
        : {}),
      ...(query.hasActiveRefreshTokens === true
        ? {
            refreshTokens: {
              some: {
                revokedAt: null,
                expiresAt: { gt: now },
              },
            },
          }
        : {}),
      ...(query.hasActiveRefreshTokens === false
        ? {
            refreshTokens: {
              none: {
                revokedAt: null,
                expiresAt: { gt: now },
              },
            },
          }
        : {}),
    };

    const orderBy = this.buildOrderBy(query.sortBy, query.sortDir);

    const [total, users] = await this.prisma.$transaction([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true,
          plan: true,
          priceCents: true,
          currency: true,
          billingStatus: true,
          termsAcceptedAt: true,
          termsVersion: true,
          _count: {
            select: {
              notes: true,
            },
          },
          refreshTokens: {
            where: {
              revokedAt: null,
              expiresAt: { gt: now },
            },
            select: {
              createdAt: true,
              expiresAt: true,
            },
          },
        },
      }),
    ]);

    const items = users.map((user) => {
      const lastIssuedAt =
        user.refreshTokens.length > 0
          ? new Date(
              Math.max(
                ...user.refreshTokens.map((refreshToken) =>
                  refreshToken.createdAt.getTime()
                )
              )
            )
          : null;

      const maxExpiresAt =
        user.refreshTokens.length > 0
          ? new Date(
              Math.max(
                ...user.refreshTokens.map((refreshToken) =>
                  refreshToken.expiresAt.getTime()
                )
              )
            )
          : null;

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLoginAt: user.lastLoginAt,
        notesCount: user._count.notes,
        plan: user.plan,
        priceCents: user.priceCents,
        currency: user.currency,
        billingStatus: user.billingStatus,
        refreshTokens: {
          activeCount: user.refreshTokens.length,
          lastIssuedAt,
          maxExpiresAt,
        },
        termsAcceptedAt: user.termsAcceptedAt,
        termsVersion: user.termsVersion,
      };
    });

    return {
      items,
      page,
      pageSize,
      total,
    };
  }


  async toggleBlock(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const status =
      user.status === UserStatus.SUSPENDED
        ? UserStatus.ACTIVE
        : UserStatus.SUSPENDED;

    const updated = await this.prisma.user.update({
      where: { id },
      data: { status },
      select: { id: true, status: true },
    });

    return {
      id: updated.id,
      status: updated.status,
      blocked: updated.status === UserStatus.SUSPENDED,
    };
  }

  private buildOrderBy(sortBy: string, sortDir: 'asc' | 'desc'): Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[] {
    if (sortBy === 'notesCount') {
      return {
        notes: {
          _count: sortDir,
        },
      };
    }

    if (sortBy === 'price') {
      return {
        priceCents: sortDir,
      };
    }

    return {
      [sortBy]: sortDir,
    };
  }
}
