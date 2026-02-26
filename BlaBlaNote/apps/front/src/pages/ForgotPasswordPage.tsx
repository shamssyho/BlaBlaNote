import { FormEvent, useState } from 'react';
import { authApi } from '../api/auth.api';
import { Link } from '../router/router';
import { ApiError } from '../types/api.types';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      const response = await authApi.forgotPassword({ email });
      setMessage(response.message);
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-page">
      <form onSubmit={onSubmit} className="auth-form">
        <h1>Forgot password</h1>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          required
        />
        {message ? <p>{message}</p> : null}
        {error ? <p className="error-text">{error}</p> : null}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send reset link'}
        </button>
        <p>
          Back to <Link to="/login">Sign in</Link>
        </p>
      </form>
    </section>
  );
}
