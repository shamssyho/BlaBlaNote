import { http } from './http';
import { CreateTagPayload, Tag, UpdateTagPayload } from '../types/tags.types';

export const tagsApi = {
  getAll() {
    return http.get<Tag[]>('/tags').then((res) => res.data);
  },
  create(payload: CreateTagPayload) {
    return http.post<Tag>('/tags', payload).then((res) => res.data);
  },
  update(id: string, payload: UpdateTagPayload) {
    return http.patch<Tag>(`/tags/${id}`, payload).then((res) => res.data);
  },
  delete(id: string) {
    return http.delete<{ success: boolean }>(`/tags/${id}`).then((res) => res.data);
  },
};
