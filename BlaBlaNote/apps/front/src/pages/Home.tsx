import { ChangeEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader } from '../components/ui/Loader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useAuth } from '../hooks/useAuth';
import { useNotes } from '../hooks/useNotes';
import { Link, useNavigate } from '../router/router';

export function HomePage() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const { notes, isLoading, error } = useNotes();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const filteredNotes = useMemo(() => {
    if (!searchValue.trim()) {
      return notes;
    }

    const normalizedValue = searchValue.toLowerCase();
    return notes.filter((note) => {
      const createdAt = new Date(note.createdAt).toLocaleString(i18n.language).toLowerCase();
      const summary = note.summary?.toLowerCase() ?? '';
      const translation = note.translation?.toLowerCase() ?? '';
      return summary.includes(normalizedValue) || translation.includes(normalizedValue) || createdAt.includes(normalizedValue);
    });
  }, [i18n.language, notes, searchValue]);

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
          <p className="text-sm font-semibold text-indigo-700">{t('home.welcomeBack')}</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {user ? `${user.firstName} ${user.lastName}` : t('home.dashboardFallback')}
          </h1>
          <p className="text-slate-600">{t('home.description')}</p>

          <div className="grid gap-3 sm:grid-cols-[auto_minmax(220px,1fr)] sm:items-center">
            <Link
              to="/notes/new"
              className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
            >
              {t('nav.createNote')}
            </Link>
            <input
              value={searchValue}
              onChange={onSearchChange}
              placeholder={t('home.searchNotes')}
              aria-label={t('home.searchNotes')}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
            />
          </div>
        </div>

        <div className="grid gap-3" aria-label={t('home.quickActions')}>
          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{t('home.totalNotes')}</p>
            <strong className="mt-1 inline-block text-2xl font-semibold text-slate-900">{notes.length}</strong>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{t('home.lastUpdated')}</p>
            <strong className="mt-1 inline-block text-2xl font-semibold text-slate-900">
              {notes[0] ? new Date(notes[0].createdAt).toLocaleDateString(i18n.language) : t('home.noDate')}
            </strong>
          </article>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-slate-900">{t('home.recentNotes')}</h2>
          <Link
            to="/notes"
            className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
          >
            {t('home.viewAll')}
          </Link>
        </div>

        {isLoading ? <Loader label={t('home.loadingNotes')} /> : null}
        {error ? <p className="error-text">{error}</p> : null}

        {!isLoading && !hasNotes ? (
          <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">{t('home.noNotesYet')}</h3>
            <p className="text-slate-600">{t('home.emptyStateDescription')}</p>
            <Link
              to="/notes/new"
              className="inline-flex w-fit items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
            >
              {t('home.createFirstNote')}
            </Link>
          </div>
        ) : null}

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedNotes.map((note) => {
            const status = note.summary && note.translation ? 'completed' : 'processing';
            const createdAt = new Date(note.createdAt).toLocaleString(i18n.language);

            return (
              <li key={note.id}>
                <button
                  type="button"
                  className="grid w-full gap-3 rounded-xl border border-slate-200 bg-white p-4 text-start shadow-sm transition hover:border-slate-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                  onClick={() => navigate(`/notes/${note.id}`)}
                  aria-label={t('home.openNoteCreatedAt', { date: createdAt })}
                >
                  <h3 className="text-sm font-semibold text-slate-900">{createdAt}</h3>
                  <p className="text-sm text-slate-600">{note.summary ?? t('home.summaryPending')}</p>
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
