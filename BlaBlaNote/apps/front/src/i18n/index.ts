import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from '../locales/en/common.json';
import enAuth from '../locales/en/auth.json';
import enHome from '../locales/en/home.json';
import enNotes from '../locales/en/notes.json';
import enProjects from '../locales/en/projects.json';
import enProfile from '../locales/en/profile.json';
import enSettings from '../locales/en/settings.json';
import enShare from '../locales/en/share.json';
import enBlog from '../locales/en/blog.json';
import enAdmin from '../locales/en/admin.json';

import frCommon from '../locales/fr/common.json';
import frAuth from '../locales/fr/auth.json';
import frHome from '../locales/fr/home.json';
import frNotes from '../locales/fr/notes.json';
import frProjects from '../locales/fr/projects.json';
import frProfile from '../locales/fr/profile.json';
import frSettings from '../locales/fr/settings.json';
import frShare from '../locales/fr/share.json';
import frBlog from '../locales/fr/blog.json';
import frAdmin from '../locales/fr/admin.json';

export const defaultNS = 'common';
export const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    home: enHome,
    notes: enNotes,
    projects: enProjects,
    profile: enProfile,
    settings: enSettings,
    share: enShare,
    blog: enBlog,
    admin: enAdmin,
  },
  fr: {
    common: frCommon,
    auth: frAuth,
    home: frHome,
    notes: frNotes,
    projects: frProjects,
    profile: frProfile,
    settings: frSettings,
    share: frShare,
    blog: frBlog,
    admin: frAdmin,
  },
} as const;

void i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
  defaultNS,
  ns: ['common', 'auth', 'home', 'notes', 'projects', 'profile', 'settings', 'share', 'blog', 'admin'],
  interpolation: { escapeValue: false },
  react: { useSuspense: true },
});

export default i18n;
