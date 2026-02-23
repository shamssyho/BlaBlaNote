export interface Project {
  id: string;
  name: string;
  createdAt: string;
}

export interface CreateProjectPayload {
  name: string;
}
