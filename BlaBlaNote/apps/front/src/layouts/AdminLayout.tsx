import { PropsWithChildren, useState } from 'react';
import { AppHeader } from '../components/layout/AppHeader';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { ADMIN_NAV_ITEMS } from '../constants/admin';
import { Link } from '../router/router';

export function AdminLayout({ children }: PropsWithChildren) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

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
              {ADMIN_NAV_ITEMS.map((item) => (
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
        <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
          <AdminSidebar
            items={ADMIN_NAV_ITEMS}
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
          />

          <section>{children}</section>
        </div>
      </main>
    </div>
  );
}
