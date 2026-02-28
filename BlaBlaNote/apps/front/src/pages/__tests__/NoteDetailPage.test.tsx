import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { NoteDetailPage } from '../NoteDetailPage';

const mockNavigate = vi.fn();

vi.mock('../../api/notes.api', () => ({
  notesApi: {
    getById: vi.fn().mockResolvedValue({
      id: 'note-1',
      text: 'Transcript',
      summary: 'Summary',
      translation: 'Translation',
      createdAt: '2025-01-01T10:00:00.000Z',
    }),
    delete: vi.fn().mockResolvedValue({ success: true }),
  },
}));

vi.mock('../../router/router', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('../../modules/notes/ShareNoteForm', () => ({
  ShareNoteForm: () => <div>Share form</div>,
}));

describe('NoteDetailPage', () => {
  it('renders summary and translation', async () => {
    render(<NoteDetailPage noteId="note-1" />);

    expect((await screen.findAllByText('Summary')).length).toBeGreaterThan(0);
    expect(screen.getAllByText('Translation').length).toBeGreaterThan(0);
  });

  it('navigates back to notes after delete', async () => {
    render(<NoteDetailPage noteId="note-1" />);

    await screen.findByText('Note detail');
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/notes'));
  });
});
