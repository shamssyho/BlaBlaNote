import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { BlogService } from './blog.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { GetBlogPostsQueryDto } from './dto/get-blog-posts-query.dto';
import { BlogPostEntity } from './entities/blog-post.entity';
import { PaginatedBlogPostsEntity } from './entities/paginated-blog-posts.entity';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
import { BlogCategoryEntity } from './entities/blog-category.entity';

type AuthUser = {
  id: string;
  role: 'ADMIN' | 'USER';
};

@ApiTags('Blog')
@Controller()
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get('blog')
  @ApiOperation({ summary: 'Get published blog posts with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'categorySlug', required: false, type: String, example: 'productivity' })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'notes' })
  @ApiResponse({ status: 200, type: PaginatedBlogPostsEntity })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  getPublishedPosts(@Query() query: GetBlogPostsQueryDto) {
    return this.blogService.getPublishedPosts(query);
  }

  @Get('blog/categories')
  @ApiOperation({ summary: 'Get all blog categories' })
  @ApiResponse({ status: 200, type: [BlogCategoryEntity] })
  getCategories() {
    return this.blogService.getCategories();
  }

  @Get('blog/:slug')
  @ApiOperation({ summary: 'Get one published blog post by slug' })
  @ApiParam({ name: 'slug', example: 'how-to-organize-your-notes-efficiently' })
  @ApiResponse({ status: 200, type: BlogPostEntity })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  getPublishedPostBySlug(@Param('slug') slug: string) {
    return this.blogService.getPublishedPostBySlug(slug);
  }

  @Post('admin/blog')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create blog post (Admin only)' })
  @ApiResponse({ status: 201, type: BlogPostEntity })
  @ApiResponse({ status: 400, description: 'Validation failed or invalid categoryId' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  createPost(@Req() req: Request, @Body() dto: CreateBlogPostDto) {
    const user = req.user as AuthUser;
    return this.blogService.createPost(user.id, dto);
  }

  @Patch('admin/blog/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update blog post (Admin only)' })
  @ApiResponse({ status: 200, type: BlogPostEntity })
  @ApiResponse({ status: 400, description: 'Validation failed or invalid categoryId' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  updatePost(@Param('id') id: string, @Body() dto: UpdateBlogPostDto) {
    return this.blogService.updatePost(id, dto);
  }

  @Delete('admin/blog/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete blog post (Admin only)' })
  @ApiResponse({ status: 200, description: 'Blog post deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  deletePost(@Param('id') id: string) {
    return this.blogService.deletePost(id);
  }

  @Post('admin/blog/categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create blog category (Admin only)' })
  @ApiResponse({ status: 201, type: BlogCategoryEntity })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  createCategory(@Body() dto: CreateBlogCategoryDto) {
    return this.blogService.createCategory(dto);
  }

  @Patch('admin/blog/categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update blog category (Admin only)' })
  @ApiResponse({ status: 200, type: BlogCategoryEntity })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Blog category not found' })
  updateCategory(@Param('id') id: string, @Body() dto: UpdateBlogCategoryDto) {
    return this.blogService.updateCategory(id, dto);
  }

  @Delete('admin/blog/categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete blog category (Admin only)' })
  @ApiResponse({ status: 200, description: 'Blog category deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Blog category not found' })
  deleteCategory(@Param('id') id: string) {
    return this.blogService.deleteCategory(id);
  }
}
