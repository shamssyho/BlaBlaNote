import { PropsWithChildren } from 'react';
import { AppHeader } from '../components/layout/AppHeader';
import { useProjects } from '../hooks/useProjects';
import { CreateProjectForm } from '../modules/projects/CreateProjectForm';

export function AppLayout({ children }: PropsWithChildren) {
  const { projects, isLoading, error, refetch } = useProjects();

  return (
    <div className="app-shell">
      <AppHeader />

      <main className="content">
        {children}

        <section className="projects-panel" aria-label="Projects overview">
          <div className="projects-panel-header">
            <h2>Projects</h2>
          </div>

          {isLoading ? <p>Loading projects...</p> : null}
          {error ? <p className="error-text">{error}</p> : null}

          <ul className="projects-items">
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
