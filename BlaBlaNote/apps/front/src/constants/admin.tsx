import { ReactElement } from 'react';

export interface AdminModule {
  title: string;
  description: string;
  ctaLabel: string;
  to?: string;
  icon: ReactElement;
}

export interface AdminRouteItem {
  label: string;
  description: string;
  to: string;
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

export const ADMIN_NAV_ITEMS: AdminRouteItem[] = [
  { label: 'Dashboard', description: 'Overview and quick links', to: '/admin' },
  { label: 'Users', description: 'Manage accounts and status', to: '/admin/users' },
  { label: 'Notes', description: 'Monitor note activity', to: '/admin/notes' },
  { label: 'Blog', description: 'Manage posts and publish state', to: '/admin/blog' },
  { label: 'Blog Categories', description: 'Manage blog categories', to: '/admin/blog/categories' },
  { label: 'Billing', description: 'Plans and revenue insights', to: '/admin/billing' },
];

export const ADMIN_DASHBOARD_MODULES: AdminModule[] = [
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
    title: 'Blog Management',
    description: 'Create posts, edit drafts, and control publishing from one dashboard.',
    ctaLabel: 'Open blog management',
    to: '/admin/blog',
    icon: <NotesIcon />,
  },
  {
    title: 'Blog Categories',
    description: 'Manage category taxonomy used for blog filtering and organization.',
    ctaLabel: 'Open categories manager',
    to: '/admin/blog/categories',
    icon: <ShieldIcon />,
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
