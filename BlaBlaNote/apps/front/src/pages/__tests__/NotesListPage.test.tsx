import { render, screen } from '@testing-library/react';
import { NotesListPage } from '../NotesListPage';

const mockUseNotes = vi.fn();

vi.mock('../../hooks/useNotes', () => ({
  useNotes: () => mockUseNotes(),
}));

vi.mock('../../router/router', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock('../../modules/notes/CreateNoteForm', () => ({
  CreateNoteForm: () => <div>Create</div>,
}));

describe('NotesListPage', () => {
  it('shows loading state', () => {
    mockUseNotes.mockReturnValue({ notes: [], isLoading: true, error: null, refetch: vi.fn() });

    render(<NotesListPage />);

    expect(screen.getByText(/loading/i)).toBeTruthy();
  });

  it('shows error state', () => {
    mockUseNotes.mockReturnValue({ notes: [], isLoading: false, error: 'boom', refetch: vi.fn() });

    render(<NotesListPage />);

    expect(screen.getByText('boom')).toBeTruthy();
  });

  it('renders notes from api', () => {
    mockUseNotes.mockReturnValue({
      notes: [{ id: '1', summary: 'Summary', translation: 'Translation', createdAt: '2025-01-01T10:00:00.000Z' }],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<NotesListPage />);

    expect(screen.getByText('Summary')).toBeTruthy();
  });
});
