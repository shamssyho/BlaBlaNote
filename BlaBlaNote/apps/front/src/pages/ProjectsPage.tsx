import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { projectsApi } from '../api/projects.api';
import { Loader } from '../components/ui/Loader';
import { useProjects } from '../hooks/useProjects';
import { useNavigate } from '../router/router';
import { ApiError } from '../types/api.types';

export function ProjectsPage() {
  const { t } = useTranslation(['projects', 'common']);
  const { projects, isLoading, error, refetch } = useProjects();
  const navigate = useNavigate();
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  async function onCreate(event: FormEvent) {
    event.preventDefault();
    setActionError(null);

    try {
      await projectsApi.create({ name: newName });
      setNewName('');
      await refetch();
    } catch (err) {
      setActionError((err as ApiError).message);
    }
  }

  async function onDelete(projectId: string) {
    if (!window.confirm(t('projects:deleteConfirm'))) {
      return;
    }

    setActionError(null);

    try {
      await projectsApi.delete(projectId);
      await refetch();
    } catch (err) {
      setActionError((err as ApiError).message);
    }
  }

  async function onRename(event: FormEvent) {
    event.preventDefault();

    if (!editingId) {
      return;
    }

    setActionError(null);

    try {
      await projectsApi.update(editingId, { name: editingName });
      setEditingId(null);
      setEditingName('');
      await refetch();
    } catch (err) {
      setActionError((err as ApiError).message);
    }
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{t('projects:title')}</h1>
      </header>

      <form className="flex gap-2" onSubmit={onCreate}>
        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          placeholder={t('projects:createPlaceholder')}
          required
        />
        <button className="rounded-lg bg-slate-900 px-4 py-2 text-white">{t('projects:create')}</button>
      </form>

      {isLoading ? <Loader label={t('projects:loading')} /> : null}
      {error ? <p className="error-text">{error}</p> : null}
      {actionError ? <p className="error-text">{actionError}</p> : null}

      {!isLoading && projects.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">{t('projects:empty')}</p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <article key={project.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            {editingId === project.id ? (
              <form className="space-y-2" onSubmit={onRename}>
                <input
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  value={editingName}
                  onChange={(event) => setEditingName(event.target.value)}
                  required
                />
                <div className="flex gap-2">
                  <button className="rounded-md bg-slate-900 px-3 py-1.5 text-sm text-white">{t('common:actions.save')}</button>
                  <button type="button" className="rounded-md border border-slate-300 px-3 py-1.5 text-sm" onClick={() => setEditingId(null)}>
                    {t('common:actions.cancel')}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <p className="text-sm text-slate-600">{t('projects:notesCount', { count: project.notesCount })}</p>
                <p className="text-xs text-slate-500">{t('projects:createdAt', { date: new Date(project.createdAt).toLocaleDateString() })}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="rounded-md bg-slate-900 px-3 py-1.5 text-sm text-white" onClick={() => navigate(`/projects/${project.id}`)}>
                    {t('common:actions.open')}
                  </button>
                  <button
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
                    onClick={() => {
                      setEditingId(project.id);
                      setEditingName(project.name);
                    }}
                  >
                    {t('common:actions.edit')}
                  </button>
                  <button className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-700" onClick={() => onDelete(project.id)}>
                    {t('common:actions.delete')}
                  </button>
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
