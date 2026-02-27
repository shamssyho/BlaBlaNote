import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    const { firstName, lastName, email, password } = dto;
    const existingUser = await this.prisma.user.findUnique({
      where: { email: email },
    });
    if (existingUser) throw new ConflictException('Email already in use');
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: { firstName, lastName, email, password: hashedPassword },
    });
  }

  async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email: email } });
  }

  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (dto.password) dto.password = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.update({ where: { id }, data: dto });
  }
  async updateUserRole(id: string, role: 'ADMIN' | 'USER') {
    return this.prisma.user.update({
      where: { id },
      data: { role },
    });
  }


  async acceptTerms(userId: string, termsVersion = 'v1.0') {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        termsAcceptedAt: new Date(),
        termsVersion,
      },
    });
  }

  async exportUserData(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        notes: {
          include: {
            noteTags: {
              include: {
                tag: true,
              },
            },
            shareLinks: {
              select: {
                id: true,
                noteId: true,
                expiresAt: true,
                allowSummary: true,
                allowTranscript: true,
                createdAt: true,
              },
            },
          },
        },
        projects: true,
        tags: true,
        createdShareLinks: {
          select: {
            id: true,
            noteId: true,
            expiresAt: true,
            allowSummary: true,
            allowTranscript: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return {
      profile: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
        termsAcceptedAt: user.termsAcceptedAt,
        termsVersion: user.termsVersion,
        lastLoginAt: user.lastLoginAt,
        suspendedAt: user.suspendedAt,
        deletedAt: user.deletedAt,
        plan: user.plan,
        priceCents: user.priceCents,
        currency: user.currency,
        billingStatus: user.billingStatus,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      notes: user.notes.map((note) => ({
        id: note.id,
        projectId: note.projectId,
        text: note.text,
        transcriptText: note.transcriptText,
        status: note.status,
        errorMessage: note.errorMessage,
        summary: note.summary,
        translation: note.translation,
        audioUrl: note.audioUrl,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
        tags: note.noteTags.map((noteTag) => ({
          id: noteTag.tag.id,
          name: noteTag.tag.name,
          slug: noteTag.tag.slug,
          createdAt: noteTag.tag.createdAt,
          updatedAt: noteTag.tag.updatedAt,
        })),
        shareLinks: note.shareLinks,
      })),
      projects: user.projects,
      tags: user.tags,
      shareLinks: user.createdShareLinks,
    };
  }

  async deleteMyAccount(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    await this.prisma.user.delete({ where: { id: userId } });
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.user.delete({ where: { id } });
  }
}
