import { ChangeEvent, useMemo, useState } from 'react';
import { Loader } from '../components/ui/Loader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useAuth } from '../hooks/useAuth';
import { useNotes } from '../hooks/useNotes';
import { Link, useNavigate } from '../router/router';

export function HomePage() {
  const { user } = useAuth();
  const { notes, isLoading, error } = useNotes();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const filteredNotes = useMemo(() => {
    if (!searchValue.trim()) {
      return notes;
    }

    const normalizedValue = searchValue.toLowerCase();
    return notes.filter((note) => {
      const createdAt = new Date(note.createdAt).toLocaleString().toLowerCase();
      const summary = note.summary?.toLowerCase() ?? '';
      const translation = note.translation?.toLowerCase() ?? '';
      return summary.includes(normalizedValue) || translation.includes(normalizedValue) || createdAt.includes(normalizedValue);
    });
  }, [notes, searchValue]);

  const sortedNotes = useMemo(
    () => [...filteredNotes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6),
    [filteredNotes]
  );

  const hasNotes = notes.length > 0;

  function onSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchValue(event.target.value);
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-indigo-700">Welcome back</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {user ? `${user.firstName} ${user.lastName}` : 'Your notes dashboard'}
          </h1>
          <p className="text-slate-600">Capture ideas quickly, review recent recordings, and keep your note flow organized.</p>

          <div className="grid gap-3 sm:grid-cols-[auto_minmax(220px,1fr)] sm:items-center">
            <Link
              to="/notes/new"
              className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
            >
              Create note
            </Link>
            <input
              value={searchValue}
              onChange={onSearchChange}
              placeholder="Search notes"
              aria-label="Search notes"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
            />
          </div>
        </div>

        <div className="grid gap-3" aria-label="Quick stats">
          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Total notes</p>
            <strong className="mt-1 inline-block text-2xl font-semibold text-slate-900">{notes.length}</strong>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Last updated</p>
            <strong className="mt-1 inline-block text-2xl font-semibold text-slate-900">
              {notes[0] ? new Date(notes[0].createdAt).toLocaleDateString() : '—'}
            </strong>
          </article>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-slate-900">Recent notes</h2>
          <Link
            to="/notes"
            className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
          >
            View all
          </Link>
        </div>

        {isLoading ? <Loader label="Loading notes..." /> : null}
        {error ? <p className="error-text">{error}</p> : null}

        {!isLoading && !hasNotes ? (
          <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">No notes yet</h3>
            <p className="text-slate-600">Start your workspace by creating your first note.</p>
            <Link
              to="/notes/new"
              className="inline-flex w-fit items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
            >
              Create your first note
            </Link>
          </div>
        ) : null}

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedNotes.map((note) => {
            const status = note.summary && note.translation ? 'completed' : 'processing';

            return (
              <li key={note.id}>
                <button
                  type="button"
                  className="grid w-full gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-slate-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                  onClick={() => navigate(`/notes/${note.id}`)}
                  aria-label={`Open note created at ${new Date(note.createdAt).toLocaleString()}`}
                >
                  <h3 className="text-sm font-semibold text-slate-900">{new Date(note.createdAt).toLocaleString()}</h3>
                  <p className="text-sm text-slate-600">{note.summary ?? 'Summary pending...'}</p>
                  <StatusBadge status={status} />
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </section>
  );
}
