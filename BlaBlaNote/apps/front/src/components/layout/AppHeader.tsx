import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link, NavLink, usePathname } from '../../router/router';

const NAV_ITEMS = [
  { label: 'Home', to: '/home' },
  { label: 'Notes', to: '/notes' },
  { label: 'Create note', to: '/notes/new' },
] as const;

export function AppHeader() {
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

  const sharedRouteExists = false;

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <div className="app-header-brand">
          <button
            type="button"
            className="header-menu-toggle"
            onClick={() => setMobileMenuOpen((value) => !value)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            ☰
          </button>

          <Link to="/home" className="header-logo-link">
            BlaBlaNote
          </Link>
        </div>

        <nav className="header-nav" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className="header-nav-link" activeClassName="header-nav-link active">
              {item.label}
            </NavLink>
          ))}

          {sharedRouteExists ? (
            <NavLink to="/shared" className="header-nav-link" activeClassName="header-nav-link active">
              Shared
            </NavLink>
          ) : (
            <span className="header-nav-link disabled" aria-disabled="true" title="Shared notes route not available yet">
              Shared
            </span>
          )}
        </nav>

        <div className="user-menu" ref={userMenuRef}>
          <button
            type="button"
            className="user-menu-trigger"
            onClick={() => setUserMenuOpen((value) => !value)}
            aria-haspopup="menu"
            aria-expanded={userMenuOpen}
            aria-label="Open user menu"
          >
            <span className="avatar-badge">{initials || 'U'}</span>
          </button>

          {userMenuOpen ? (
            <div className="user-menu-dropdown" role="menu" aria-label="User menu">
              <Link to="/profile" className="user-menu-item">
                Profile
              </Link>
              <Link to="/settings" className="user-menu-item">
                Settings
              </Link>
              <button type="button" onClick={logout} className="user-menu-item danger-item">
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {mobileMenuOpen ? (
        <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile primary navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className="mobile-nav-link" activeClassName="mobile-nav-link active">
              {item.label}
            </NavLink>
          ))}
          {sharedRouteExists ? (
            <NavLink to="/shared" className="mobile-nav-link" activeClassName="mobile-nav-link active">
              Shared
            </NavLink>
          ) : (
            <span className="mobile-nav-link disabled" aria-disabled="true">
              Shared (coming soon)
            </span>
          )}
        </nav>
      ) : null}
    </header>
  );
}
