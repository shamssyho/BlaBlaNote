import { FormEvent, useState } from 'react';
import { projectsApi } from '../../api/projects.api';
import { ApiError } from '../../types/api.types';

interface CreateProjectFormProps {
  onCreated: () => void;
}

export function CreateProjectForm({ onCreated }: CreateProjectFormProps) {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await projectsApi.create({ name });
      setName('');
      onCreated();
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="panel-form">
      <h3>Create project</h3>
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Project name"
        required
      />
      {error ? <p className="error-text">{error}</p> : null}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
