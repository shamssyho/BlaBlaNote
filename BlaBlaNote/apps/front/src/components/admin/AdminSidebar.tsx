import { cn } from '../../lib/cn';
import { Link, usePathname } from '../../router/router';

export interface AdminNavItem {
  label: string;
  description: string;
  to: string;
}

interface AdminSidebarProps {
  items: AdminNavItem[];
  isCollapsed: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ items, isCollapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'hidden h-fit rounded-xl border border-slate-200 bg-white p-3 shadow-sm lg:block',
        isCollapsed ? 'w-20' : 'w-72'
      )}
      aria-label="Admin navigation"
    >
      <button
        type="button"
        onClick={onToggle}
        className="mb-3 inline-flex w-full items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
        aria-expanded={!isCollapsed}
      >
        {isCollapsed ? 'Expand' : 'Collapse'}
      </button>

      <nav className="space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'block rounded-lg px-3 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2',
                isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              )}
            >
              <p className="text-sm font-semibold">{isCollapsed ? item.label.charAt(0) : item.label}</p>
              {!isCollapsed ? <p className={cn('text-xs', isActive ? 'text-slate-200' : 'text-slate-500')}>{item.description}</p> : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
