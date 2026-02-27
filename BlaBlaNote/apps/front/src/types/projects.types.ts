import { Note } from './notes.types';

export interface Project {
  id: string;
  name: string;
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
}

export interface UpdateProjectPayload {
  name: string;
}
