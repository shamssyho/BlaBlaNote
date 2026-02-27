import { ADMIN_NAV_ITEMS } from '../../constants/admin';
import { Link, usePathname } from '../../router/router';

interface AdminPlaceholderPageProps {
  title: string;
  description: string;
}

export function AdminPlaceholderPage({ title, description }: AdminPlaceholderPageProps) {
  const pathname = usePathname();
  const currentIndex = ADMIN_NAV_ITEMS.findIndex((item) => item.to === pathname);
  const previous = currentIndex > 0 ? ADMIN_NAV_ITEMS[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < ADMIN_NAV_ITEMS.length - 1 ? ADMIN_NAV_ITEMS[currentIndex + 1] : null;

  return (
    <div className="space-y-6">
      <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
      </header>

      <section className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-slate-600 shadow-sm">
        <p className="text-sm">This module is prepared for upcoming admin capabilities.</p>
      </section>

      <nav className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm" aria-label="Module navigation">
        {previous ? (
          <Link
            to={previous.to}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
          >
            ← Previous: {previous.label}
          </Link>
        ) : (
          <span className="text-sm text-slate-400">No previous module</span>
        )}

        {next ? (
          <Link
            to={next.to}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
          >
            Next: {next.label} →
          </Link>
        ) : (
          <span className="text-sm text-slate-400">No next module</span>
        )}
      </nav>
    </div>
  );
}
