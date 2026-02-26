import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { persistLanguage, SupportedLanguage } from '../../i18n/detectLanguage';
import { Link, NavLink, usePathname } from '../../router/router';

const NAV_ITEMS = [
  { labelKey: 'nav.home', to: '/home' },
  { labelKey: 'nav.notes', to: '/notes' },
  { labelKey: 'nav.createNote', to: '/notes/new' },
] as const;

const LANGUAGE_OPTIONS: SupportedLanguage[] = ['fr', 'en', 'ar'];

export function AppHeader() {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const initials = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .map((value) => value?.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);

  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      if (!userMenuRef.current?.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', onDocumentClick);
    return () => {
      document.removeEventListener('mousedown', onDocumentClick);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  function onLanguageChange(language: SupportedLanguage) {
    void i18n.changeLanguage(language);
    persistLanguage(language);
  }

  const sharedRouteExists = false;

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <div className="app-header-brand">
          <button
            type="button"
            className="header-menu-toggle"
            onClick={() => setMobileMenuOpen((value) => !value)}
            aria-label={t('nav.toggleNavigation')}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            ☰
          </button>

          <Link to="/home" className="header-logo-link">
            BlaBlaNote
          </Link>
        </div>

        <nav className="header-nav" aria-label={t('nav.primaryNavigation')}>
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className="header-nav-link" activeClassName="header-nav-link active">
              {t(item.labelKey)}
            </NavLink>
          ))}

          {sharedRouteExists ? (
            <NavLink to="/shared" className="header-nav-link" activeClassName="header-nav-link active">
              {t('nav.shared')}
            </NavLink>
          ) : (
            <span className="header-nav-link disabled" aria-disabled="true" title={t('nav.sharedUnavailable')}>
              {t('nav.shared')}
            </span>
          )}
        </nav>

        <div className="header-actions">
          <div className="language-switcher" role="group" aria-label={t('nav.language')}>
            {LANGUAGE_OPTIONS.map((language) => {
              const isActive = i18n.language === language;
              return (
                <button
                  key={language}
                  type="button"
                  className={`language-option${isActive ? ' active' : ''}`}
                  onClick={() => onLanguageChange(language)}
                  aria-pressed={isActive}
                >
                  {language.toUpperCase()}
                </button>
              );
            })}
          </div>

          <div className="user-menu" ref={userMenuRef}>
            <button
              type="button"
              className="user-menu-trigger"
              onClick={() => setUserMenuOpen((value) => !value)}
              aria-haspopup="menu"
              aria-expanded={userMenuOpen}
              aria-label={t('nav.openUserMenu')}
            >
              <span className="avatar-badge">{initials || t('common.fallbackUserInitial')}</span>
            </button>

            {userMenuOpen ? (
              <div className="user-menu-dropdown" role="menu" aria-label={t('nav.userMenu')}>
                <Link to="/profile" className="user-menu-item">
                  {t('nav.profile')}
                </Link>
                <Link to="/settings" className="user-menu-item">
                  {t('nav.settings')}
                </Link>
                <button type="button" onClick={logout} className="user-menu-item danger-item">
                  {t('nav.logout')}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {mobileMenuOpen ? (
        <nav id="mobile-nav" className="mobile-nav" aria-label={t('nav.mobileNavigation')}>
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className="mobile-nav-link" activeClassName="mobile-nav-link active">
              {t(item.labelKey)}
            </NavLink>
          ))}
          {sharedRouteExists ? (
            <NavLink to="/shared" className="mobile-nav-link" activeClassName="mobile-nav-link active">
              {t('nav.shared')}
            </NavLink>
          ) : (
            <span className="mobile-nav-link disabled" aria-disabled="true">
              {t('nav.sharedComingSoon')}
            </span>
          )}
        </nav>
      ) : null}
    </header>
  );
}
