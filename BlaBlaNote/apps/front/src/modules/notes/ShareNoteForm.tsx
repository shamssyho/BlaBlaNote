import { FormEvent, useState } from 'react';
import { notesApi } from '../../api/notes.api';
import { ApiError } from '../../types/api.types';
import { ShareNotePayload } from '../../types/notes.types';

interface ShareNoteFormProps {
  noteId: string;
}

const defaultPayload: ShareNotePayload = {
  method: 'email',
  to: '',
  type: 'summary',
};

export function ShareNoteForm({ noteId }: ShareNoteFormProps) {
  const [payload, setPayload] = useState<ShareNotePayload>(defaultPayload);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      await notesApi.share(noteId, payload);
      setSuccess('Note shared successfully.');
      setPayload(defaultPayload);
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="panel-form" onSubmit={onSubmit}>
      <h3>Share note</h3>
      <select
        value={payload.method}
        onChange={(event) =>
          setPayload((previous) => ({ ...previous, method: event.target.value as ShareNotePayload['method'] }))
        }
      >
        <option value="email">Email</option>
        <option value="whatsapp">WhatsApp</option>
      </select>
      <input
        value={payload.to}
        placeholder="Recipient"
        onChange={(event) => setPayload((previous) => ({ ...previous, to: event.target.value }))}
        required
      />
      <select
        value={payload.type}
        onChange={(event) =>
          setPayload((previous) => ({ ...previous, type: event.target.value as ShareNotePayload['type'] }))
        }
      >
        <option value="summary">Summary</option>
        <option value="translation">Translation</option>
      </select>
      {error ? <p className="error-text">{error}</p> : null}
      {success ? <p className="success-text">{success}</p> : null}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sharing...' : 'Share'}
      </button>
    </form>
  );
}
