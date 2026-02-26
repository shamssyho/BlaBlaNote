import { ChangeEvent, useMemo, useState } from 'react';
import { Loader } from '../components/ui/Loader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useAuth } from '../hooks/useAuth';
import { useNotes } from '../hooks/useNotes';
import { Link, useNavigate } from '../router/router';

export function DashboardPage() {
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
    <section className="dashboard-page">
      <div className="dashboard-top">
        <div className="welcome-card">
          <p className="welcome-eyebrow">Welcome back</p>
          <h1>
            {user ? `${user.firstName} ${user.lastName}` : 'Your notes dashboard'}
          </h1>
          <p>Capture ideas quickly, review recent recordings, and keep your note flow organized.</p>
          <div className="welcome-actions">
            <Link to="/notes/new" className="primary-link">
              Create note
            </Link>
            <input
              value={searchValue}
              onChange={onSearchChange}
              placeholder="Search notes"
              aria-label="Search notes"
            />
          </div>
        </div>

        <div className="stats-grid" aria-label="Quick stats">
          <article className="stat-card">
            <p>Total notes</p>
            <strong>{notes.length}</strong>
          </article>
          <article className="stat-card">
            <p>Last updated</p>
            <strong>{notes[0] ? new Date(notes[0].createdAt).toLocaleDateString() : '—'}</strong>
          </article>
        </div>
      </div>

      <section className="recent-notes-section">
        <div className="section-heading">
          <h2>Recent notes</h2>
          <Link to="/notes" className="secondary-link">
            View all
          </Link>
        </div>

        {isLoading ? <Loader label="Loading notes..." /> : null}
        {error ? <p className="error-text">{error}</p> : null}

        {!isLoading && !hasNotes ? (
          <div className="empty-state">
            <h3>No notes yet</h3>
            <p>Start your workspace by creating your first note.</p>
            <Link to="/notes/new" className="primary-link">
              Create your first note
            </Link>
          </div>
        ) : null}

        <ul className="notes-grid">
          {sortedNotes.map((note) => {
            const status = note.summary && note.translation ? 'completed' : 'processing';

            return (
              <li key={note.id} className="note-card" onClick={() => navigate(`/notes/${note.id}`)}>
                <h3>{new Date(note.createdAt).toLocaleString()}</h3>
                <p>{note.summary ?? 'Summary pending...'}</p>
                <StatusBadge status={status} />
              </li>
            );
          })}
        </ul>
      </section>
    </section>
  );
}
