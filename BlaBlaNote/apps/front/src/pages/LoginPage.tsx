import { FormEvent, useState } from 'react';
import { Link, useNavigate } from '../router/router';
import { useAuth } from '../hooks/useAuth';
import { ApiError } from '../types/api.types';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password, rememberMe });
      navigate('/dashboard');
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-page">
      <form onSubmit={onSubmit} className="auth-form">
        <h1>Login</h1>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          required
        />
        <label>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
          />{' '}
          Remember me
        </label>
        {error ? <p className="error-text">{error}</p> : null}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
        <p>
          <Link to="/forgot-password">Forgot password?</Link>
        </p>
        <p>
          No account? <Link to="/register">Create one</Link>
        </p>
      </form>
    </section>
  );
}
