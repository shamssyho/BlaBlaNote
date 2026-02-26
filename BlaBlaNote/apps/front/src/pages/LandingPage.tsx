import { Link } from '../router/router';

const FEATURES = [
  {
    title: 'Capture ideas instantly',
    description: 'Create, tag, and organize notes in seconds so your thoughts are never lost.',
  },
  {
    title: 'Follow your progress',
    description: 'Track processing status and keep important content visible with a clean dashboard.',
  },
  {
    title: 'Collaborate with confidence',
    description: 'Share notes with your team and keep everyone aligned in one workspace.',
  },
];

export function LandingPage() {
  return (
    <main className="landing-page">
      <header className="landing-header">
        <p className="brand">BlaBlaNote</p>
        <nav className="landing-nav" aria-label="Main navigation">
          <Link to="/login">Sign in</Link>
          <Link to="/register" className="nav-cta">
            Get started
          </Link>
        </nav>
      </header>

      <section className="hero-section">
        <p className="eyebrow">Notes that actually move work forward</p>
        <h1>Turn scattered thoughts into clear, shareable knowledge.</h1>
        <p className="hero-copy">
          BlaBlaNote helps teams write faster, stay organized, and collaborate without switching tools.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="primary-link">
            Start free
          </Link>
          <Link to="/login" className="secondary-link">
            I already have an account
          </Link>
        </div>
      </section>

      <section className="features-section" aria-label="Product features">
        {FEATURES.map((feature) => (
          <article key={feature.title} className="feature-card">
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </article>
        ))}
      </section>

      <section className="cta-section">
        <h2>Built for focused teams</h2>
        <p>Start in minutes with a simple workflow designed for speed and clarity on every device.</p>
        <Link to="/register" className="primary-link">
          Create your workspace
        </Link>
      </section>
    </main>
  );
}
