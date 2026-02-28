import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { notesApi } from '../../api/notes.api';
import { useProjects } from '../../hooks/useProjects';
import { useTags } from '../../hooks/useTags';
import { ApiError } from '../../types/api.types';

interface CreateNoteFormProps {
  onCreated: () => void;
}

export function CreateNoteForm({ onCreated }: CreateNoteFormProps) {
  const { t } = useTranslation('notes');
  const { projects } = useProjects();
  const { tags } = useTags();
  const [file, setFile] = useState<File | null>(null);
  const [projectId, setProjectId] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
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
      const created = await notesApi.createAudioNote(file);
      if (created?.noteId && projectId) {
        await notesApi.updateProject(created.noteId, projectId);
      }
      if (created?.noteId && selectedTagIds.length) {
        await notesApi.updateTags(created.noteId, selectedTagIds);
      }
      setFile(null);
      setProjectId('');
      setSelectedTagIds([]);
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
      <input type="file" accept="audio/*" onChange={(event) => setFile(event.target.files?.[0] ?? null)} required />
      <select value={projectId} onChange={(event) => setProjectId(event.target.value)}>
        <option value="">No project</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>{project.name}</option>
        ))}
      </select>
      <select
        multiple
        value={selectedTagIds}
        onChange={(event) => setSelectedTagIds(Array.from(event.target.selectedOptions).map((option) => option.value))}
      >
        {tags.map((tag) => (
          <option key={tag.id} value={tag.id}>{tag.name}</option>
        ))}
      </select>
      {error ? <p className="error-text">{error}</p> : null}
      <button type="submit" disabled={isSubmitting}>{isSubmitting ? t('create.submitting') : t('create.submit')}</button>
    </form>
  );
}
