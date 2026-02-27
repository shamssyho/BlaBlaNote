import { AdminCard } from '../../components/admin/AdminCard';
import { ADMIN_DASHBOARD_MODULES } from '../../constants/admin';

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Admin Dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Centralize admin workflows in one place with clear modules and scalable navigation.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3" aria-label="Admin modules">
        {ADMIN_DASHBOARD_MODULES.map((module) => (
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
  );
}
