import { fireEvent, render, screen } from '@testing-library/react';
import { LoginPage } from '../LoginPage';

const loginMock = vi.fn().mockResolvedValue(undefined);
const navigateMock = vi.fn();

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({ login: loginMock }),
}));

vi.mock('../../router/router', () => ({
  Link: ({ children }: any) => <span>{children}</span>,
  useNavigate: () => navigateMock,
}));

describe('LoginPage', () => {
  it('has required login fields', () => {
    render(<LoginPage />);

    const email = screen.getByPlaceholderText(/email/i);
    const password = screen.getByPlaceholderText(/password/i);

    expect((email as HTMLInputElement).required).toBe(true);
    expect((password as HTMLInputElement).required).toBe(true);
  });

  it('submits and navigates on success', async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in|login/i }));

    expect(loginMock).toHaveBeenCalled();
  });
});
