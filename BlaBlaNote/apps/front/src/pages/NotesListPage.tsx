import { useState } from 'react';
import { useNavigate } from '../router/router';
import { FloatingActionButton } from '../components/ui/FloatingActionButton';
import { Loader } from '../components/ui/Loader';
import { useNotes } from '../hooks/useNotes';
import { useTags } from '../hooks/useTags';
import { CreateNoteForm } from '../modules/notes/CreateNoteForm';

export function NotesListPage() {
  const [tagIds, setTagIds] = useState<string[]>([]);
  const { tags } = useTags();
  const { notes, isLoading, error, refetch } = useNotes(tagIds);
  const navigate = useNavigate();

  return (
    <section>
      <header className="page-header">
        <h1>Notes</h1>
      </header>
      <CreateNoteForm onCreated={refetch} />
      <select multiple value={tagIds} onChange={(event) => setTagIds(Array.from(event.target.selectedOptions).map((option) => option.value))}>
        {tags.map((tag) => (
          <option key={tag.id} value={tag.id}>{tag.name}</option>
        ))}
      </select>
      {isLoading ? <Loader label="Loading notes" /> : null}
      {error ? <p className="error-text">{error}</p> : null}
      <ul className="notes-grid">
        {notes.map((note) => (
          <li key={note.id} className="note-card" onClick={() => navigate(`/notes/${note.id}`)}>
            <h3>{new Date(note.createdAt).toLocaleString()}</h3>
            {note.project ? <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: note.project.color }} />{note.project.name}</span> : null}
            <p>{note.summary ?? 'Summary pending'}</p>
            <div className="flex flex-wrap gap-1">
              {note.noteTags?.map((noteTag) => (
                <span key={noteTag.tag.id} className="rounded-full border px-2 py-0.5 text-xs" style={{ borderColor: noteTag.tag.color ?? '#94a3b8' }}>
                  {noteTag.tag.name}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <FloatingActionButton onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} label="+" />
    </section>
  );
}
