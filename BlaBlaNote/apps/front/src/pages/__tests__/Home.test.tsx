import { fireEvent, render, screen } from '@testing-library/react';
import { HomePage } from '../Home';

const mockNavigate = vi.fn();
const mockUseNotes = vi.fn();

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({ user: { firstName: 'John', lastName: 'Doe' } }),
}));

vi.mock('../../hooks/useNotes', () => ({
  useNotes: () => mockUseNotes(),
}));

vi.mock('../../router/router', () => ({
  Link: ({ children }: any) => <span>{children}</span>,
  useNavigate: () => mockNavigate,
}));

describe('HomePage', () => {
  it('renders welcome and recent notes with filtering', () => {
    mockUseNotes.mockReturnValue({
      notes: [
        { id: '1', summary: 'Project summary', translation: 'Bonjour', createdAt: '2025-01-01T10:00:00.000Z' },
        { id: '2', summary: 'Another note', translation: 'Salut', createdAt: '2025-01-02T10:00:00.000Z' },
      ],
      isLoading: false,
      error: null,
    });

    render(<HomePage />);

    expect(screen.getByText('John Doe')).toBeTruthy();
    expect(screen.getByText('home.recentNotes')).toBeTruthy();

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'another' } });

    expect(screen.getByText('Another note')).toBeTruthy();
    expect(screen.queryByText('Project summary')).not.toBeTruthy();
  });

  it('renders empty state when no notes', () => {
    mockUseNotes.mockReturnValue({ notes: [], isLoading: false, error: null });

    render(<HomePage />);

    expect(screen.getByText('home.noNotesYet')).toBeTruthy();
  });
});
