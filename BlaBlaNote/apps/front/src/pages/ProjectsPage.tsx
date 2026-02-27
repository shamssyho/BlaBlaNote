import { FormEvent, useState } from 'react';
import { projectsApi } from '../api/projects.api';
import { Loader } from '../components/ui/Loader';
import { useProjects } from '../hooks/useProjects';
import { useNavigate } from '../router/router';
import { ApiError } from '../types/api.types';

export function ProjectsPage() {
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
    if (!window.confirm('Delete this project? Notes will stay but be unassigned.')) {
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
        <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
      </header>

      <form className="flex gap-2" onSubmit={onCreate}>
        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          placeholder="Create Project"
          required
        />
        <button className="rounded-lg bg-slate-900 px-4 py-2 text-white">Create</button>
      </form>

      {isLoading ? <Loader label="Loading projects..." /> : null}
      {error ? <p className="error-text">{error}</p> : null}
      {actionError ? <p className="error-text">{actionError}</p> : null}

      {!isLoading && projects.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">No projects yet.</p>
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
                  <button className="rounded-md bg-slate-900 px-3 py-1.5 text-sm text-white">Save</button>
                  <button type="button" className="rounded-md border border-slate-300 px-3 py-1.5 text-sm" onClick={() => setEditingId(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <p className="text-sm text-slate-600">{project.notesCount} notes</p>
                <p className="text-xs text-slate-500">Created {new Date(project.createdAt).toLocaleDateString()}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="rounded-md bg-slate-900 px-3 py-1.5 text-sm text-white" onClick={() => navigate(`/projects/${project.id}`)}>
                    Open
                  </button>
                  <button
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
                    onClick={() => {
                      setEditingId(project.id);
                      setEditingName(project.name);
                    }}
                  >
                    Edit
                  </button>
                  <button className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-700" onClick={() => onDelete(project.id)}>
                    Delete
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
