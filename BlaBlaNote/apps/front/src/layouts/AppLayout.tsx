import { PropsWithChildren } from 'react';
import { NavLink } from '../router/router';
import { useProjects } from '../hooks/useProjects';
import { useAuth } from '../hooks/useAuth';
import { CreateProjectForm } from '../modules/projects/CreateProjectForm';

export function AppLayout({ children }: PropsWithChildren) {
  const { projects, isLoading, error, refetch } = useProjects();
  const { logout, user } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Blabla note</h1>
          {user && (
            <p>
              Welcome, {user.firstName} {user.lastName}
            </p>
          )}
          <button type="button" onClick={logout}>
            Logout
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/notes">Notes</NavLink>
        </nav>

        <section className="projects-list">
          <h2>Projects</h2>
          {isLoading ? <p>Loading projects...</p> : null}
          {error ? <p className="error-text">{error}</p> : null}
          <ul>
            {projects.map((project) => (
              <li key={project.id}>{project.name}</li>
            ))}
          </ul>
        </section>

        <CreateProjectForm onCreated={refetch} />
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}
