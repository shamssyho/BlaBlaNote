export const SUPPORTED_LANGUAGES = ['en', 'fr'] as const;

export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const APP_LANGUAGE_STORAGE_KEY = 'app_lang';

function isSupportedLanguage(value: string): value is AppLanguage {
  return SUPPORTED_LANGUAGES.includes(value as AppLanguage);
}

export function resolveSupportedLanguage(value: string | null | undefined): AppLanguage | null {
  if (!value) {
    return null;
  }

  const normalized = value.toLowerCase();

  if (isSupportedLanguage(normalized)) {
    return normalized;
  }

  const prefix = normalized.split('-')[0];
  if (isSupportedLanguage(prefix)) {
    return prefix;
  }

  return null;
}

export function getDeviceLanguage(): AppLanguage {
  const languageCandidates = [
    ...(Array.isArray(navigator.languages) ? navigator.languages : []),
    navigator.language,
  ].filter(Boolean);

  for (const candidate of languageCandidates) {
    const matched = resolveSupportedLanguage(candidate);
    if (matched) {
      return matched;
    }
  }

  return 'en';
}

export function getInitialLanguage(): AppLanguage {
  const storedLanguage = resolveSupportedLanguage(localStorage.getItem(APP_LANGUAGE_STORAGE_KEY));
  const resolvedLanguage = storedLanguage ?? getDeviceLanguage();
  localStorage.setItem(APP_LANGUAGE_STORAGE_KEY, resolvedLanguage);
  return resolvedLanguage;
}

export function applyDocumentDirection(language: AppLanguage) {
  document.documentElement.dir = 'ltr';
  document.documentElement.lang = language;
}

export function persistLanguage(language: string) {
  const normalizedLanguage = resolveSupportedLanguage(language) ?? 'en';
  localStorage.setItem(APP_LANGUAGE_STORAGE_KEY, normalizedLanguage);
}
