import { Tag } from './tags.types';

export type NoteProcessingStatus = 'UPLOADED' | 'PROCESSING_SUMMARY' | 'PROCESSING_TRANSLATION' | 'READY' | 'FAILED';

export interface Note {
  id: string;
  userId: string;
  text: string;
  summary: string | null;
  translation: string | null;
  audioUrl: string | null;
  projectId: string | null;
  status: NoteProcessingStatus;
  project?: { id: string; name: string; color: string } | null;
  noteTags?: { tag: Tag }[];
  createdAt: string;
  updatedAt: string;
}

export interface ShareNotePayload {
  channel: 'EMAIL' | 'WHATSAPP' | 'NOTION';
  destination: string;
  contentType: 'SUMMARY' | 'TRANSLATION' | 'BOTH' | 'FULL_TRANSCRIPTION';
  targetLanguage?: string;
}
