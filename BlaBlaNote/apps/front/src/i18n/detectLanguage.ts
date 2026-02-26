export type SupportedLanguage = 'fr' | 'en' | 'ar';

export const APP_LANG_STORAGE_KEY = 'app_lang';

const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['fr', 'en', 'ar'];

function normalizeLanguage(value?: string | null): SupportedLanguage | null {
  if (!value) {
    return null;
  }

  const normalized = value.toLowerCase();

  if (SUPPORTED_LANGUAGES.includes(normalized as SupportedLanguage)) {
    return normalized as SupportedLanguage;
  }

  const [prefix] = normalized.split('-');
  if (SUPPORTED_LANGUAGES.includes(prefix as SupportedLanguage)) {
    return prefix as SupportedLanguage;
  }

  return null;
}

export function getDeviceLanguage(): SupportedLanguage {
  if (typeof navigator !== 'undefined') {
    const candidates = [...(navigator.languages ?? []), navigator.language].filter(Boolean);

    for (const candidate of candidates) {
      const matchedLanguage = normalizeLanguage(candidate);
      if (matchedLanguage) {
        return matchedLanguage;
      }
    }
  }

  return 'fr';
}

export function getInitialLanguage(): SupportedLanguage {
  if (typeof window !== 'undefined') {
    const storedLanguage = normalizeLanguage(window.localStorage.getItem(APP_LANG_STORAGE_KEY));
    if (storedLanguage) {
      window.localStorage.setItem(APP_LANG_STORAGE_KEY, storedLanguage);
      return storedLanguage;
    }

    const deviceLanguage = getDeviceLanguage();
    window.localStorage.setItem(APP_LANG_STORAGE_KEY, deviceLanguage);
    return deviceLanguage;
  }

  return getDeviceLanguage();
}

export function persistLanguage(language: SupportedLanguage) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(APP_LANG_STORAGE_KEY, language);
  }
}

export function applyDocumentDirection(language: SupportedLanguage) {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = language;
}
