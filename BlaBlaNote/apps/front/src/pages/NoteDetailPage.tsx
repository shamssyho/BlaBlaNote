import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('notes');
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

    void loadNote();
  }, [noteId]);

  async function refresh() {
    const data = await notesApi.getById(noteId);
    setNote(data);
  }

  async function onSummarize() {
    await notesApi.summarize(noteId);
    await refresh();
  }

  async function onTranslate() {
    await notesApi.translate(noteId);
    await refresh();
  }

  async function onDelete() {
    await notesApi.delete(noteId);
    navigate('/notes');
  }

  if (isLoading) {
    return <Loader label={t('detail.loading')} />;
  }

  if (error || !note) {
    return <p className="error-text">{error ?? t('detail.notFound')}</p>;
  }

  return (
    <section className="note-detail">
      <h1>{t('detail.title')}</h1>
      <p>
        <strong>{t('detail.created')}</strong> {new Date(note.createdAt).toLocaleString()}
      </p>
      <article>
        <h2>{t('detail.transcription')}</h2>
        <p>{note.text}</p>
      </article>
      <article>
        <h2>{t('detail.summary')}</h2>
        <p>{note.summary ?? t('detail.summaryProcessing')}</p>
      </article>
      <article>
        <h2>{t('detail.translation')}</h2>
        <p>{note.translation ?? t('detail.translationProcessing')}</p>
      </article>
      <div className="flex gap-2">
        <button type="button" onClick={onSummarize} disabled={note.status.includes('PROCESSING')}>Summarize</button>
        <button type="button" onClick={onTranslate} disabled={note.status.includes('PROCESSING')}>Translate</button>
      </div>
      <ShareNoteForm noteId={note.id} />
      <button type="button" className="danger-button" onClick={onDelete}>
        {t('detail.delete')}
      </button>
    </section>
  );
}
