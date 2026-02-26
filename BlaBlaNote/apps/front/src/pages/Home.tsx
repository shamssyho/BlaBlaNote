import { ChangeEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader } from '../components/ui/Loader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useAuth } from '../hooks/useAuth';
import { useNotes } from '../hooks/useNotes';
import { Link, useNavigate } from '../router/router';

export function HomePage() {
  const { t } = useTranslation();
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
          <p className="welcome-eyebrow">{t('home.welcomeBack')}</p>
          <h1>
            {user ? `${user.firstName} ${user.lastName}` : t('home.yourDashboard')}
          </h1>
          <p>{t('home.subtitle')}</p>
          <div className="welcome-actions-label">{t('home.quickActions')}</div>
          <div className="welcome-actions">
            <Link to="/notes/new" className="primary-link">
              {t('nav.createNote')}
            </Link>
            <input
              value={searchValue}
              onChange={onSearchChange}
              placeholder={t('home.searchNotes')}
              aria-label={t('home.searchNotes')}
            />
          </div>
        </div>

        <div className="stats-grid" aria-label={t('home.quickActions')}>
          <article className="stat-card">
            <p>{t('home.totalNotes')}</p>
            <strong>{notes.length}</strong>
          </article>
          <article className="stat-card">
            <p>{t('home.lastUpdated')}</p>
            <strong>{notes[0] ? new Date(notes[0].createdAt).toLocaleDateString() : '—'}</strong>
          </article>
        </div>
      </div>

      <section className="recent-notes-section">
        <div className="section-heading">
          <h2>{t('home.recentNotes')}</h2>
          <Link to="/notes" className="secondary-link">
            {t('home.viewAll')}
          </Link>
        </div>

        {isLoading ? <Loader label={t('home.loadingNotes')} /> : null}
        {error ? <p className="error-text">{error}</p> : null}

        {!isLoading && !hasNotes ? (
          <div className="empty-state">
            <h3>{t('home.noNotesYet')}</h3>
            <p>{t('home.emptyStateDescription')}</p>
            <Link to="/notes/new" className="primary-link">
              {t('home.createFirstNote')}
            </Link>
          </div>
        ) : null}

        <ul className="notes-grid">
          {sortedNotes.map((note) => {
            const status = note.summary && note.translation ? 'completed' : 'processing';

            return (
              <li key={note.id} className="note-card" onClick={() => navigate(`/notes/${note.id}`)}>
                <h3>{new Date(note.createdAt).toLocaleString()}</h3>
                <p>{note.summary ?? t('home.summaryPending')}</p>
                <StatusBadge status={status} />
              </li>
            );
          })}
        </ul>
      </section>
    </section>
  );
}
