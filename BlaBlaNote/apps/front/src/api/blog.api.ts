import { http } from './http';
import {
  BlogCategory,
  BlogPost,
  CreateBlogCategoryPayload,
  CreateBlogPostPayload,
  GetBlogPostsParams,
  PaginatedBlogPosts,
  UpdateBlogPostPayload,
} from '../types/blog.types';

export const blogApi = {
  getPosts(params: GetBlogPostsParams) {
    return http.get<PaginatedBlogPosts>('/blog', { params }).then((res) => res.data);
  },
  getPostBySlug(slug: string) {
    return http.get<BlogPost>(`/blog/${slug}`).then((res) => res.data);
  },
  getCategories() {
    return http.get<BlogCategory[]>('/blog/categories').then((res) => res.data);
  },
  adminCreatePost(payload: CreateBlogPostPayload) {
    return http.post<BlogPost>('/admin/blog', payload).then((res) => res.data);
  },
  adminUpdatePost(id: string, payload: UpdateBlogPostPayload) {
    return http.patch<BlogPost>(`/admin/blog/${id}`, payload).then((res) => res.data);
  },
  adminDeletePost(id: string) {
    return http.delete<{ success: boolean }>(`/admin/blog/${id}`).then((res) => res.data);
  },
  adminCreateCategory(payload: CreateBlogCategoryPayload) {
    return http.post<BlogCategory>('/admin/blog/categories', payload).then((res) => res.data);
  },
  adminUpdateCategory(id: string, payload: CreateBlogCategoryPayload) {
    return http.patch<BlogCategory>(`/admin/blog/categories/${id}`, payload).then((res) => res.data);
  },
  adminDeleteCategory(id: string) {
    return http.delete<{ success: boolean }>(`/admin/blog/categories/${id}`).then((res) => res.data);
  },
};
