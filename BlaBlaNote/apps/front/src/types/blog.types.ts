export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  published: boolean;
  authorId: string;
  categoryId?: string | null;
  category?: BlogCategory | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedBlogPosts {
  items: BlogPost[];
  page: number;
  pageSize: number;
  total: number;
}

export interface GetBlogPostsParams {
  page?: number;
  pageSize?: number;
  categorySlug?: string;
  search?: string;
}

export interface CreateBlogPostPayload {
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  published?: boolean;
  categoryId?: string;
}

export type UpdateBlogPostPayload = Partial<CreateBlogPostPayload>;

export interface CreateBlogCategoryPayload {
  name: string;
}
