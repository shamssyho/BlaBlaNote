import { useTranslation } from 'react-i18next';
import { useNavigate } from '../router/router';
import { FloatingActionButton } from '../components/ui/FloatingActionButton';
import { Loader } from '../components/ui/Loader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useNotes } from '../hooks/useNotes';
import { CreateNoteForm } from '../modules/notes/CreateNoteForm';

export function NotesListPage() {
  const { t } = useTranslation('notes');
  const { notes, isLoading, error, refetch } = useNotes();
  const navigate = useNavigate();
  const hasNotes = notes.length > 0;

  return (
    <section>
      <header className="page-header">
        <h1>{t('list.title')}</h1>
      </header>

      <CreateNoteForm onCreated={refetch} />

      {isLoading ? <Loader label={t('list.loading')} /> : null}
      {error ? <p className="error-text">{error}</p> : null}

      {!isLoading && !hasNotes ? <p>{t('list.empty')}</p> : null}

      <ul className="notes-grid">
        {notes.map((note) => {
          const status = note.summary && note.translation ? 'completed' : 'processing';

          return (
            <li key={note.id} className="note-card" onClick={() => navigate(`/notes/${note.id}`)}>
              <h3>{new Date(note.createdAt).toLocaleString()}</h3>
              <p>{note.summary ?? t('list.summaryPending')}</p>
              <StatusBadge status={status} />
            </li>
          );
        })}
      </ul>

      <FloatingActionButton onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} label="+" />
    </section>
  );
}
