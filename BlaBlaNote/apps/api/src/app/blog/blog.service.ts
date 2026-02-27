import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { GetBlogPostsQueryDto } from './dto/get-blog-posts-query.dto';
import { buildUniqueSlug } from './utils/slug';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublishedPosts(query: GetBlogPostsQueryDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const skip = (page - 1) * pageSize;

    const where = {
      published: true,
      ...(query.categorySlug
        ? { category: { slug: query.categorySlug } }
        : {}),
      ...(query.search
        ? {
            OR: [
              { title: { contains: query.search, mode: 'insensitive' as const } },
              { excerpt: { contains: query.search, mode: 'insensitive' as const } },
              { content: { contains: query.search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    return { items, page, pageSize, total };
  }

  async getPublishedPostBySlug(slug: string) {
    const post = await this.prisma.blogPost.findFirst({
      where: { slug, published: true },
      include: { category: true },
    });

    if (!post) {
      throw new NotFoundException('Blog post not found');
    }

    return post;
  }

  async getCategories() {
    return this.prisma.blogCategory.findMany({ orderBy: { name: 'asc' } });
  }

  async createPost(userId: string, dto: CreateBlogPostDto) {
    const categoryId = await this.validateCategory(dto.categoryId);
    const slug = await buildUniqueSlug(dto.title, async (candidate) => {
      const existing = await this.prisma.blogPost.findUnique({ where: { slug: candidate } });
      return Boolean(existing);
    });

    return this.prisma.blogPost.create({
      data: {
        title: dto.title,
        slug,
        excerpt: dto.excerpt,
        content: dto.content,
        coverImage: dto.coverImage,
        published: dto.published ?? false,
        authorId: userId,
        categoryId,
      },
      include: { category: true },
    });
  }

  async updatePost(id: string, dto: UpdateBlogPostDto) {
    const existing = await this.prisma.blogPost.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException('Blog post not found');
    }

    const categoryId = dto.categoryId === undefined ? undefined : await this.validateCategory(dto.categoryId);

    let slug: string | undefined;
    if (dto.title && dto.title !== existing.title) {
      slug = await buildUniqueSlug(
        dto.title,
        async (candidate) => {
          const found = await this.prisma.blogPost.findUnique({ where: { slug: candidate } });
          return Boolean(found && found.id !== id);
        },
        existing.slug
      );
    }

    return this.prisma.blogPost.update({
      where: { id },
      data: {
        title: dto.title,
        slug,
        excerpt: dto.excerpt,
        content: dto.content,
        coverImage: dto.coverImage,
        published: dto.published,
        categoryId,
      },
      include: { category: true },
    });
  }

  async deletePost(id: string) {
    const existing = await this.prisma.blogPost.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException('Blog post not found');
    }

    await this.prisma.blogPost.delete({ where: { id } });

    return { success: true };
  }

  async createCategory(dto: CreateBlogCategoryDto) {
    const slug = await buildUniqueSlug(dto.name, async (candidate) => {
      const existing = await this.prisma.blogCategory.findUnique({ where: { slug: candidate } });
      return Boolean(existing);
    });

    return this.prisma.blogCategory.create({
      data: {
        name: dto.name,
        slug,
      },
    });
  }

  async updateCategory(id: string, dto: UpdateBlogCategoryDto) {
    const existing = await this.prisma.blogCategory.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException('Blog category not found');
    }

    const slug = await buildUniqueSlug(
      dto.name,
      async (candidate) => {
        const found = await this.prisma.blogCategory.findUnique({ where: { slug: candidate } });
        return Boolean(found && found.id !== id);
      },
      existing.slug
    );

    return this.prisma.blogCategory.update({
      where: { id },
      data: { name: dto.name, slug },
    });
  }

  async deleteCategory(id: string) {
    const existing = await this.prisma.blogCategory.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException('Blog category not found');
    }

    await this.prisma.blogCategory.delete({ where: { id } });

    return { success: true };
  }

  private async validateCategory(categoryId?: string) {
    if (categoryId === undefined) {
      return undefined;
    }

    if (!categoryId) {
      return null;
    }

    const category = await this.prisma.blogCategory.findUnique({ where: { id: categoryId } });

    if (!category) {
      throw new BadRequestException('Invalid categoryId');
    }

    return categoryId;
  }
}
