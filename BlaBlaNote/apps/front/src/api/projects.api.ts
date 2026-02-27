import { http } from './http';
import {
  CreateProjectPayload,
  Project,
  ProjectDetail,
  UpdateProjectPayload,
} from '../types/projects.types';

export const projectsApi = {
  getAll() {
    return http.get<Project[]>('/projects').then((res) => res.data);
  },
  create(payload: CreateProjectPayload) {
    return http.post<Project>('/projects', payload).then((res) => res.data);
  },
  update(id: string, payload: UpdateProjectPayload) {
    return http.patch<Project>(`/projects/${id}`, payload).then((res) => res.data);
  },
  delete(id: string) {
    return http.delete<{ success: boolean }>(`/projects/${id}`).then((res) => res.data);
  },
  getNotes(id: string) {
    return http.get<ProjectDetail>(`/projects/${id}/notes`).then((res) => res.data);
  },
};
