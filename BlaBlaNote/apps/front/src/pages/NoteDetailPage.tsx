import { useEffect, useState } from 'react';
import { notesApi } from '../api/notes.api';
import { Loader } from '../components/ui/Loader';
import { ShareNoteForm } from '../modules/notes/ShareNoteForm';
import { useNavigate } from '../router/router';
import { ApiError } from '../types/api.types';
import { Note } from '../types/notes.types';

interface NoteDetailPageProps {
  noteId: string;
}

export function NoteDetailPage({ noteId }: NoteDetailPageProps) {
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNote() {
      try {
        const data = await notesApi.getById(noteId);
        setNote(data);
      } catch (err) {
        setError((err as ApiError).message);
      } finally {
        setIsLoading(false);
      }
    }

    loadNote();
  }, [noteId]);

  async function onDelete() {
    await notesApi.delete(noteId);
    navigate('/notes');
  }

  if (isLoading) {
    return <Loader label="Loading note..." />;
  }

  if (error || !note) {
    return <p className="error-text">{error ?? 'Note not found.'}</p>;
  }

  return (
    <section className="note-detail">
      <h1>Note detail</h1>
      <p>
        <strong>Created:</strong> {new Date(note.createdAt).toLocaleString()}
      </p>
      <article>
        <h2>Transcription</h2>
        <p>{note.text}</p>
      </article>
      <article>
        <h2>Summary</h2>
        <p>{note.summary ?? 'Summary is still processing.'}</p>
      </article>
      <article>
        <h2>Translation</h2>
        <p>{note.translation ?? 'Translation is still processing.'}</p>
      </article>
      <ShareNoteForm noteId={note.id} />
      <button type="button" className="danger-button" onClick={onDelete}>
        Delete note
      </button>
    </section>
  );
}
