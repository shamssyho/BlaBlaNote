export type NoteProcessingStatus = 'processing' | 'completed';

export interface Note {
  id: string;
  userId: string;
  text: string;
  summary: string | null;
  translation: string | null;
  audioUrl: string | null;
  projectId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotePayload {
  file: File;
}

export interface ShareNotePayload {
  method: 'email' | 'whatsapp';
  to: string;
  type: 'summary' | 'translation';
}
