import { useNavigate } from '../router/router';
import { FloatingActionButton } from '../components/ui/FloatingActionButton';
import { Loader } from '../components/ui/Loader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useNotes } from '../hooks/useNotes';
import { CreateNoteForm } from '../modules/notes/CreateNoteForm';

export function NotesListPage() {
  const { notes, isLoading, error, refetch } = useNotes();
  const navigate = useNavigate();
  const hasNotes = notes.length > 0;

  return (
    <section>
      <header className="page-header">
        <h1>Notes</h1>
      </header>

      <CreateNoteForm onCreated={refetch} />

      {isLoading ? <Loader label="Loading notes..." /> : null}
      {error ? <p className="error-text">{error}</p> : null}

      {!isLoading && !hasNotes ? <p>No notes available yet.</p> : null}

      <ul className="notes-grid">
        {notes.map((note) => {
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

      <FloatingActionButton onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} label="+" />
    </section>
  );
}
