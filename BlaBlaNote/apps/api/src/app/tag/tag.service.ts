import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { buildUniqueSlug } from '../blog/utils/slug';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  getTags(userId: string) {
    return this.prisma.tag.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createTag(userId: string, dto: CreateTagDto) {
    const slug = await this.getUniqueSlug(userId, dto.name);
    return this.prisma.tag.create({
      data: {
        userId,
        name: dto.name,
        slug,
        color: dto.color ?? null,
      },
    });
  }

  async updateTag(userId: string, id: string, dto: UpdateTagDto) {
    const existing = await this.ensureTagOwnership(id, userId);
    const slug = dto.name
      ? await this.getUniqueSlug(userId, dto.name, existing.slug)
      : existing.slug;

    return this.prisma.tag.update({
      where: { id },
      data: {
        name: dto.name,
        slug,
        color: dto.color ?? null,
      },
    });
  }

  async deleteTag(userId: string, id: string) {
    await this.ensureTagOwnership(id, userId);
    await this.prisma.tag.delete({ where: { id } });
    return { success: true };
  }

  async ensureTagOwnership(tagId: string, userId: string) {
    const tag = await this.prisma.tag.findUnique({ where: { id: tagId } });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    if (tag.userId !== userId) {
      throw new ForbiddenException('You cannot access this tag');
    }

    return tag;
  }

  private async getUniqueSlug(
    userId: string,
    name: string,
    excludedSlug?: string
  ) {
    return buildUniqueSlug(
      name,
      async (slug) =>
        Boolean(
          await this.prisma.tag.findFirst({
            where: {
              userId,
              slug,
            },
            select: { id: true },
          })
        ),
      excludedSlug
    );
  }
}
