import { http } from './http';
import { CreateProjectPayload, Project } from '../types/projects.types';

export const projectsApi = {
  getAll() {
    return http.get<Project[]>('/projects').then((res) => res.data);
  },
  create(payload: CreateProjectPayload) {
    return http.post<Project>('/projects', payload).then((res) => res.data);
  },
};
