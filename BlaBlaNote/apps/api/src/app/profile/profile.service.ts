import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ProfileStorageService } from './profile.storage.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profileStorageService: ProfileStorageService
  ) {}

  private toSafeUser(user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isBlocked: boolean;
    avatarUrl: string | null;
    language: string;
    theme: string;
    notificationsEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isBlocked: user.isBlocked,
      avatarUrl: user.avatarUrl,
      language: user.language,
      theme: user.theme,
      notificationsEnabled: user.notificationsEnabled,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async getMe(userId: string) {
    if (!userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.isBlocked) {
      throw new ForbiddenException('User is blocked');
    }

    return this.toSafeUser(user);
  }

  async updateMe(userId: string, dto: UpdateProfileDto) {
    if (!userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    const existingUser = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        language: dto.language,
        theme: dto.theme,
        notificationsEnabled: dto.notificationsEnabled,
      },
    });

    return this.toSafeUser(user);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValidCurrentPassword = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isValidCurrentPassword) {
      throw new BadRequestException('Current password is invalid');
    }

    const isSamePassword = await bcrypt.compare(dto.newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException('New password must be different from current password');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: true };
  }

  async deleteMe(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({ where: { id: userId } });

    return { success: true, message: 'Account deleted successfully' };
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Avatar file is required');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const avatarUrl = await this.profileStorageService.uploadAvatar(userId, file);

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
    });

    return this.toSafeUser(updatedUser);
  }
}
