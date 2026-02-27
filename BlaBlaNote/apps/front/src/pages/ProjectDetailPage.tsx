import { FormEvent, useEffect, useMemo, useState } from 'react';
import { notesApi } from '../api/notes.api';
import { projectsApi } from '../api/projects.api';
import { Loader } from '../components/ui/Loader';
import { useProjects } from '../hooks/useProjects';
import { ApiError } from '../types/api.types';
import { Note } from '../types/notes.types';

interface ProjectDetailPageProps {
  projectId: string;
}

export function ProjectDetailPage({ projectId }: ProjectDetailPageProps) {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const { projects } = useProjects();

  const targetProjects = useMemo(() => projects.filter((project) => project.id !== projectId), [projects, projectId]);

  async function loadProject() {
    setIsLoading(true);
    setError(null);

    try {
      const data = await projectsApi.getNotes(projectId);
      setName(data.name);
      setNotes(data.notes);
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadProject();
  }, [projectId]);

  async function onCreateNote(event: FormEvent) {
    event.preventDefault();

    try {
      const note = await notesApi.create({ text: newNoteText });
      await notesApi.updateProject(note.id, projectId);
      setNewNoteText('');
      await loadProject();
    } catch (err) {
      setError((err as ApiError).message);
    }
  }

  async function onMove(noteId: string, targetProjectId: string | null) {
    try {
      await notesApi.updateProject(noteId, targetProjectId);
      await loadProject();
    } catch (err) {
      setError((err as ApiError).message);
    }
  }

  if (isLoading) {
    return <Loader label="Loading project..." />;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">{name}</h1>
      </header>

      <form className="space-y-2 rounded-xl border border-slate-200 bg-white p-4" onSubmit={onCreateNote}>
        <h2 className="font-semibold">Add note to project</h2>
        <textarea
          className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2"
          value={newNoteText}
          onChange={(event) => setNewNoteText(event.target.value)}
          placeholder="Write a note..."
          required
        />
        <button className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white">Add note</button>
      </form>

      {notes.length === 0 ? <p className="text-slate-500">No notes in this project.</p> : null}

      <ul className="space-y-3">
        {notes.map((note) => (
          <li key={note.id} className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
            <p className="font-medium">{new Date(note.createdAt).toLocaleString()}</p>
            <p className="text-sm text-slate-700">{note.summary ?? note.text.slice(0, 180)}</p>
            <div className="flex flex-wrap gap-2">
              <select
                className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                defaultValue=""
                onChange={(event) => {
                  const value = event.target.value;
                  if (!value) {
                    return;
                  }
                  void onMove(note.id, value);
                }}
              >
                <option value="">Move to project...</option>
                {targetProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <button
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
                onClick={() => {
                  void onMove(note.id, null);
                }}
              >
                Remove from project
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
