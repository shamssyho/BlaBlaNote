import { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { profileApi } from '../api/profileApi';
import { FormMessage } from '../components/profile/FormMessage';
import { SettingsField } from '../components/profile/SettingsField';
import { Loader } from '../components/ui/Loader';
import { ApiError } from '../types/api.types';

const THEME_STORAGE_KEY = 'blablanote-theme';

export function SettingsPage() {
  const { t } = useTranslation('settings');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === 'light' || storedTheme === 'dark') {
      setTheme(storedTheme);
      document.documentElement.dataset.theme = storedTheme;
    }

    profileApi
      .getMe()
      .then((profile) => {
        setLanguage(profile.language);
        setTheme(profile.theme);
        setNotificationsEnabled(profile.notificationsEnabled);
        localStorage.setItem(THEME_STORAGE_KEY, profile.theme);
        document.documentElement.dataset.theme = profile.theme;
      })
      .catch((error: ApiError) => {
        setErrorMessage(error.message);
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function onSave(event: FormEvent) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSaving(true);

    try {
      const user = await profileApi.updateMe({
        language,
        theme,
        notificationsEnabled,
      });
      localStorage.setItem(THEME_STORAGE_KEY, user.theme);
      document.documentElement.dataset.theme = user.theme;
      setSuccessMessage(t('saved'));
      await i18n.changeLanguage(user.language);
    } catch (error) {
      setErrorMessage((error as ApiError).message);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <Loader label={t('loading')} />;
  }

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
      <FormMessage type="success" message={successMessage} />
      <FormMessage type="error" message={errorMessage} />

      <form className="space-y-4 rounded-xl border border-slate-200 bg-white p-6" onSubmit={onSave}>
        <SettingsField label={t('language.label')}>
          <select
            className="rounded-lg border border-slate-300 px-3 py-2"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          >
            <option value="en">{t('language.en')}</option>
            <option value="fr">{t('language.fr')}</option>
                      </select>
        </SettingsField>

        <SettingsField label={t('theme.label')}>
          <select
            className="rounded-lg border border-slate-300 px-3 py-2"
            value={theme}
            onChange={(event) => setTheme(event.target.value as 'light' | 'dark')}
          >
            <option value="light">{t('theme.light')}</option>
            <option value="dark">{t('theme.dark')}</option>
          </select>
        </SettingsField>

        <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
          <span className="text-sm font-medium text-slate-700">{t('notifications')}</span>
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={(event) => setNotificationsEnabled(event.target.checked)}
          />
        </label>

        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-white"
          disabled={isSaving}
        >
          {isSaving ? t('saving') : t('save')}
        </button>
      </form>
    </section>
  );
}
