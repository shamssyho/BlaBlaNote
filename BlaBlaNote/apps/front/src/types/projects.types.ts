import { Note } from './notes.types';

export interface Project {
  id: string;
  name: string;
  color: string;
  notesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDetail {
  id: string;
  name: string;
  notes: Note[];
}

export interface CreateProjectPayload {
  name: string;
  color: string;
}

export interface UpdateProjectPayload {
  name?: string;
  color?: string;
}
