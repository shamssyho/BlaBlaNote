export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagPayload {
  name: string;
  color?: string;
}

export type UpdateTagPayload = Partial<CreateTagPayload>;
