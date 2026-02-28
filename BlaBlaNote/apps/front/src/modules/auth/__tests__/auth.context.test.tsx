import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider } from '../auth.context';
import { useAuth } from '../../../hooks/useAuth';

const refreshMock = vi.fn();

vi.mock('../../../api/auth.api', () => ({
  authApi: {
    refresh: () => refreshMock(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}));

vi.mock('../../../api/http', () => ({
  registerAuthLogoutHandler: vi.fn(),
}));

function Consumer() {
  const auth = useAuth();
  return <div>{auth.isLoading ? 'loading' : auth.isAuthenticated ? 'yes' : 'no'}</div>;
}

describe('AuthProvider', () => {
  it('calls refresh once on mount', async () => {
    refreshMock.mockResolvedValue({ access_token: 'token' });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText('yes')).toBeTruthy());
    expect(refreshMock).toHaveBeenCalledTimes(1);
  });
});
