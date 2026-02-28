import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { notesApi } from '../../api/notes.api';
import { ApiError } from '../../types/api.types';

interface CreateNoteFormProps {
  onCreated: () => void;
}

export function CreateNoteForm({ onCreated }: CreateNoteFormProps) {
  const { t } = useTranslation('notes');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setError(t('create.chooseFileError'));
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await notesApi.createAudioNote(file);
      setFile(null);
      onCreated();
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="panel-form">
      <h3>{t('create.title')}</h3>
      <input
        type="file"
        accept="audio/*"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        required
      />
      {error ? <p className="error-text">{error}</p> : null}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t('create.submitting') : t('create.submit')}
      </button>
    </form>
  );
}
