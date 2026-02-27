import { ReactNode } from 'react';
import { Link } from '../../router/router';

interface AdminCardProps {
  title: string;
  description: string;
  ctaLabel: string;
  icon: ReactNode;
  to?: string;
}

export function AdminCard({ title, description, ctaLabel, icon, to }: AdminCardProps) {
  const content = (
    <article className="group h-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus-within:ring-2 focus-within:ring-slate-900 focus-within:ring-offset-2">
      <div className="mb-4 inline-flex rounded-lg bg-slate-100 p-2 text-slate-700">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      <p className="mt-5 inline-flex items-center text-sm font-semibold text-slate-900">
        {ctaLabel}
        <span className="ml-1 transition-transform group-hover:translate-x-0.5" aria-hidden="true">
          →
        </span>
      </p>
    </article>
  );

  if (!to) {
    return (
      <div className="cursor-not-allowed opacity-75" aria-disabled="true" title="Coming soon">
        {content}
      </div>
    );
  }

  return (
    <Link to={to} className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2">
      {content}
    </Link>
  );
}
