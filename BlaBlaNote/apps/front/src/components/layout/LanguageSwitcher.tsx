import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { profileApi } from '../../api/profileApi';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/cn';
import { persistLanguage, resolveSupportedLanguage, SUPPORTED_LANGUAGES } from '../../i18n/detectLanguage';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation('common');
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  async function onLanguageChange(language: string) {
    const nextLanguage = resolveSupportedLanguage(language);
    if (!nextLanguage || nextLanguage === i18n.language || isSaving) {
      return;
    }

    persistLanguage(nextLanguage);
    await i18n.changeLanguage(nextLanguage);

    if (!user) {
      return;
    }

    try {
      setIsSaving(true);
      await profileApi.updateMe({ language: nextLanguage });
    } catch {
      return;
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-1 rounded-md border border-slate-300 bg-white p-1" aria-label={t('nav.language')}>
      {SUPPORTED_LANGUAGES.map((language) => {
        const isActive = i18n.language.startsWith(language);
        return (
          <button
            key={language}
            type="button"
            className={cn(
              'rounded px-2 py-1 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-1',
              isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
            )}
            onClick={() => void onLanguageChange(language)}
            aria-pressed={isActive}
            disabled={isSaving}
          >
            {language.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
