import { FormEvent, useState } from 'react';
import { notesApi } from '../../api/notes.api';
import { ApiError } from '../../types/api.types';
import { ShareNotePayload } from '../../types/notes.types';

interface ShareNoteFormProps {
  noteId: string;
}

const defaultPayload: ShareNotePayload = {
  channel: 'EMAIL',
  destination: '',
  contentType: 'SUMMARY',
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
      setSuccess('Shared successfully');
      setPayload(defaultPayload);
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="panel-form" onSubmit={onSubmit}>
      <h3>Share</h3>
      <select value={payload.channel} onChange={(event) => setPayload((prev) => ({ ...prev, channel: event.target.value as ShareNotePayload['channel'] }))}>
        <option value="EMAIL">Email</option>
        <option value="WHATSAPP">WhatsApp</option>
        <option value="NOTION">Notion</option>
      </select>
      <input value={payload.destination} placeholder="Destination" onChange={(event) => setPayload((prev) => ({ ...prev, destination: event.target.value }))} required />
      <select value={payload.contentType} onChange={(event) => setPayload((prev) => ({ ...prev, contentType: event.target.value as ShareNotePayload['contentType'] }))}>
        <option value="SUMMARY">Summary</option>
        <option value="TRANSLATION">Translation</option>
        <option value="BOTH">Both</option>
        <option value="FULL_TRANSCRIPTION">Full transcription</option>
      </select>
      <input value={payload.targetLanguage ?? ''} placeholder="Target language (optional)" onChange={(event) => setPayload((prev) => ({ ...prev, targetLanguage: event.target.value || undefined }))} />
      {error ? <p className="error-text">{error}</p> : null}
      {success ? <p className="success-text">{success}</p> : null}
      <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sharing...' : 'Share'}</button>
    </form>
  );
}
