import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import arTranslations from './locales/ar.json';
import enTranslations from './locales/en.json';
import frTranslations from './locales/fr.json';
import { applyDocumentDirection, getInitialLanguage } from './detectLanguage';

const initialLanguage = getInitialLanguage();

void i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: frTranslations },
    en: { translation: enTranslations },
    ar: { translation: arTranslations },
  },
  lng: initialLanguage,
  fallbackLng: 'fr',
  interpolation: {
    escapeValue: false,
  },
});

applyDocumentDirection(initialLanguage);

i18n.on('languageChanged', (language) => {
  applyDocumentDirection(language as 'fr' | 'en' | 'ar');
});

export default i18n;
