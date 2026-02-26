import { PropsWithChildren } from 'react';
import { AppHeader } from '../components/layout/AppHeader';
import { useProjects } from '../hooks/useProjects';
import { CreateProjectForm } from '../modules/projects/CreateProjectForm';

export function AppLayout({ children }: PropsWithChildren) {
  const { projects, isLoading, error, refetch } = useProjects();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AppHeader />

      <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        {children}

        <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm" aria-label="Projects overview">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Projects</h2>
          </div>

          {isLoading ? <p>Loading projects...</p> : null}
          {error ? <p className="error-text">{error}</p> : null}

          <ul className="m-0 list-none space-y-1 p-0 text-slate-700">
            {projects.map((project) => (
              <li key={project.id}>{project.name}</li>
            ))}
          </ul>

          <CreateProjectForm onCreated={refetch} />
        </section>
      </main>
    </div>
  );
}
