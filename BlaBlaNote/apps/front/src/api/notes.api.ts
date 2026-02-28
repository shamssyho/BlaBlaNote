import { http } from './http';
import { Note, ShareNotePayload } from '../types/notes.types';

type NotesListResponse = {
  items: Note[];
};

function extractNotes(data: unknown): Note[] {
  if (Array.isArray(data)) return data as Note[];
  if (data && typeof data === 'object' && Array.isArray((data as NotesListResponse).items)) {
    return (data as NotesListResponse).items;
  }
  return [];
}

export const notesApi = {
  getAll(tagIds?: string[]) {
    const query = tagIds?.length ? `?tagIds=${tagIds.join(',')}` : '';
    return http.get<Note[] | NotesListResponse>(`/notes${query}`).then((res) => extractNotes(res.data));
  },
  getById(id: string) {
    return http.get<Note>(`/notes/${id}`).then((res) => res.data);
  },
  create(payload: { text: string }) {
    return http.post<Note>('/notes', payload).then((res) => res.data);
  },
  createAudioNote(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return http.post('/whisper/transcribe', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => res.data);
  },
  updateProject(id: string, projectId: string | null) {
    return http.patch<Note>(`/notes/${id}/project`, { projectId }).then((res) => res.data);
  },
  updateTags(id: string, tagIds: string[]) {
    return http.put<Note>(`/notes/${id}/tags`, { tagIds }).then((res) => res.data);
  },
  summarize(id: string) {
    return http.post<Note>(`/notes/${id}/summarize`).then((res) => res.data);
  },
  translate(id: string) {
    return http.post<Note>(`/notes/${id}/translate`).then((res) => res.data);
  },
  share(id: string, payload: ShareNotePayload) {
    return http.post(`/notes/${id}/share`, payload).then((res) => res.data);
  },
  delete(id: string) {
    return http.delete(`/notes/${id}`).then((res) => res.data);
  },
};
