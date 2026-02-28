import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/cn';
import { Link, NavLink, usePathname } from '../../router/router';

const navLinkClassName =
  'inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2';
const navLinkActiveClassName = `${navLinkClassName} bg-slate-200 text-slate-900`;

export function AppHeader() {
  const pathname = usePathname();
  const { t } = useTranslation('common');
  const { logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const isRtl = false;

  const navItems = [
    { label: t('nav.home'), to: '/home' },
    { label: t('nav.notes'), to: '/notes' },
    { label: t('nav.createNote'), to: '/notes/new' },
    { label: t('nav.projects'), to: '/projects' },
  ] as const;

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

  const sharedRouteExists = false;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex min-h-[68px] w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-300 text-lg text-slate-900 md:hidden"
            onClick={() => setMobileMenuOpen((value) => !value)}
            aria-label={t('nav.toggleNavigation')}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            ☰
          </button>

          <Link to="/home" className="text-lg font-bold text-slate-900">
            BlaBlaNote
          </Link>
        </div>

        <nav className="hidden items-center gap-1 md:flex" aria-label={t('nav.primaryNavigation')}>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClassName} activeClassName={navLinkActiveClassName}>
              {item.label}
            </NavLink>
          ))}

          {sharedRouteExists ? (
            <NavLink to="/shared" className={navLinkClassName} activeClassName={navLinkActiveClassName}>
              {t('nav.shared')}
            </NavLink>
          ) : (
            <span
              className="inline-flex cursor-not-allowed items-center rounded-md px-3 py-2 text-sm font-medium text-slate-400"
              aria-disabled="true"
              title={t('nav.sharedUnavailable')}
            >
              {t('nav.shared')}
            </span>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              className="inline-flex rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
              onClick={() => setUserMenuOpen((value) => !value)}
              aria-haspopup="menu"
              aria-expanded={userMenuOpen}
              aria-label={t('nav.openUserMenu')}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                {initials || 'U'}
              </span>
            </button>

            {userMenuOpen ? (
              <div
                className={cn(
                  'absolute top-[calc(100%+0.5rem)] grid w-44 gap-0.5 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg',
                  isRtl ? 'left-0' : 'right-0'
                )}
                role="menu"
                aria-label={t('nav.openUserMenu')}
              >
                <Link to="/profile" className="rounded-md px-3 py-2 text-start text-sm text-slate-900 hover:bg-slate-100">
                  {t('nav.profile')}
                </Link>
                <Link to="/settings" className="rounded-md px-3 py-2 text-start text-sm text-slate-900 hover:bg-slate-100">
                  {t('nav.settings')}
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-md px-3 py-2 text-start text-sm text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {mobileMenuOpen ? (
        <nav id="mobile-nav" className="grid gap-1 border-t border-slate-200 bg-white p-4 md:hidden" aria-label={t('nav.mobilePrimaryNavigation')}>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClassName} activeClassName={navLinkActiveClassName}>
              {item.label}
            </NavLink>
          ))}
          {sharedRouteExists ? (
            <NavLink to="/shared" className={navLinkClassName} activeClassName={navLinkActiveClassName}>
              {t('nav.shared')}
            </NavLink>
          ) : (
            <span
              className={cn(
                'inline-flex cursor-not-allowed items-center rounded-md px-3 py-2 text-sm font-medium text-slate-400'
              )}
              aria-disabled="true"
            >
              {t('nav.sharedComingSoon')}
            </span>
          )}
        </nav>
      ) : null}
    </header>
  );
}
