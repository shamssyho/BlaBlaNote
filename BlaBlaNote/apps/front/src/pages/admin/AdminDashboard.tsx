import { ReactElement, useMemo, useState } from 'react';
import { AppHeader } from '../../components/layout/AppHeader';
import { AdminCard } from '../../components/admin/AdminCard';
import { AdminNavItem, AdminSidebar } from '../../components/admin/AdminSidebar';
import { Link } from '../../router/router';

interface DashboardModule {
  title: string;
  description: string;
  ctaLabel: string;
  to?: string;
  icon: ReactElement;
}

const MOBILE_NAV_ITEMS: AdminNavItem[] = [
  {
    label: 'Dashboard',
    description: 'Admin overview',
    to: '/admin',
  },
  {
    label: 'Users',
    description: 'Manage accounts',
    to: '/admin/users',
  },
];

const DASHBOARD_MODULES: DashboardModule[] = [
  {
    title: 'User Management',
    description: 'View users, filter by status, and manage account lifecycle safely.',
    ctaLabel: 'Open users console',
    to: '/admin/users',
    icon: <UsersIcon />,
  },
  {
    title: 'Notes Monitoring',
    description: 'Review global note activity and monitor content trends.',
    ctaLabel: 'Open notes monitoring',
    to: '/admin/notes',
    icon: <NotesIcon />,
  },
  {
    title: 'Subscription & Billing',
    description: 'Track plans, subscription states, and high-level revenue metrics.',
    ctaLabel: 'Open billing overview',
    to: '/admin/billing',
    icon: <BillingIcon />,
  },
  {
    title: 'Security',
    description: 'Inspect active refresh token activity and future audit logs.',
    ctaLabel: 'Security module coming soon',
    icon: <ShieldIcon />,
  },
  {
    title: 'System Health',
    description: 'Check API health and manage operational settings in one place.',
    ctaLabel: 'System module coming soon',
    icon: <SystemIcon />,
  },
];

export function AdminDashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const desktopItems = useMemo<AdminNavItem[]>(() => MOBILE_NAV_ITEMS, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AppHeader />

      <div className="border-b border-slate-200 bg-white lg:hidden">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <button
            type="button"
            className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
            onClick={() => setIsMobileNavOpen((prev) => !prev)}
            aria-expanded={isMobileNavOpen}
            aria-controls="admin-mobile-nav"
          >
            Admin navigation
          </button>

          {isMobileNavOpen ? (
            <nav id="admin-mobile-nav" className="mt-3 grid gap-2" aria-label="Admin mobile navigation">
              {MOBILE_NAV_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-6 lg:py-8">
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Admin Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Centralize admin workflows from one place. This dashboard is designed to scale as new management modules are added.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
          <AdminSidebar
            items={desktopItems}
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
          />

          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3" aria-label="Admin modules">
            {DASHBOARD_MODULES.map((module) => (
              <AdminCard
                key={module.title}
                title={module.title}
                description={module.description}
                ctaLabel={module.ctaLabel}
                to={module.to}
                icon={module.icon}
              />
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}

function iconClassName() {
  return 'h-6 w-6';
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClassName()} aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <path d="M20 8v6M17 11h6" />
    </svg>
  );
}

function NotesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClassName()} aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16l4-3h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

function BillingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClassName()} aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <path d="M7 15h2" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClassName()} aria-hidden="true">
      <path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClassName()} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7 8h10M7 12h10M7 16h6" />
    </svg>
  );
}
