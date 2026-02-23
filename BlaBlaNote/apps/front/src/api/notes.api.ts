import { http } from './http';
import { Note, ShareNotePayload } from '../types/notes.types';

export const notesApi = {
  getAll() {
    return http.get<Note[]>('/notes').then((res) => res.data);
  },
  getById(id: string) {
    return http.get<Note>(`/notes/${id}`).then((res) => res.data);
  },
  createAudioNote(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return http
      .post('/whisper/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => res.data);
  },
  delete(id: string) {
    return http.delete(`/notes/${id}`).then((res) => res.data);
  },
  share(id: string, payload: ShareNotePayload) {
    return http.post(`/notes/${id}/share`, payload).then((res) => res.data);
  },
};
