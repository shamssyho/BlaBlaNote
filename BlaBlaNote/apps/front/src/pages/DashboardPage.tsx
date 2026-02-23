import { Link } from '../router/router';

export function DashboardPage() {
  return (
    <section>
      <h1>Dashboard</h1>
      <p>Manage your voice notes, projects and sharing workflows.</p>
      <Link to="/notes" className="primary-link">
        Open notes workspace
      </Link>
    </section>
  );
}
