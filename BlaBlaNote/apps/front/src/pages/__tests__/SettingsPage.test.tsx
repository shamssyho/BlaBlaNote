import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SettingsPage } from '../SettingsPage';

const getMeMock = vi.fn();
const updateMeMock = vi.fn();
const changeLanguageMock = vi.fn().mockResolvedValue(undefined);

vi.mock('../../api/profileApi', () => ({
  profileApi: {
    getMe: () => getMeMock(),
    updateMe: (payload: any) => updateMeMock(payload),
  },
}));

vi.mock('react-i18next', async () => {
  const actual = await vi.importActual<typeof import('react-i18next')>('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
      i18n: { changeLanguage: changeLanguageMock },
    }),
  };
});

describe('SettingsPage', () => {
  it('updates language, theme and profile settings', async () => {
    getMeMock.mockResolvedValue({ language: 'en', theme: 'light', notificationsEnabled: true });
    updateMeMock.mockResolvedValue({ language: 'fr', theme: 'dark', notificationsEnabled: false });

    render(<SettingsPage />);

    await screen.findByText('title');

    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'fr' } });
    fireEvent.change(selects[1], { target: { value: 'dark' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: 'save' }));

    await waitFor(() => expect(updateMeMock).toHaveBeenCalled());
    expect(localStorage.getItem('blablanote-theme')).toBe('dark');
  });
});
