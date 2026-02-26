import { FormEvent, useMemo, useState } from 'react';
import { authApi } from '../api/auth.api';
import { Link } from '../router/router';
import { ApiError } from '../types/api.types';

export function ResetPasswordPage() {
  const token = useMemo(
    () => new URLSearchParams(window.location.search).get('token') || '',
    []
  );
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!token) {
      setError('Missing token. Please use the reset link from your email.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      await authApi.resetPassword({ token, newPassword });
      setMessage('Password reset successful. You can now sign in.');
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-page">
      <form onSubmit={onSubmit} className="auth-form">
        <h1>Reset password</h1>
        <input
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          placeholder="New password"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Confirm password"
          required
        />
        {message ? <p>{message}</p> : null}
        {error ? <p className="error-text">{error}</p> : null}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Resetting...' : 'Reset password'}
        </button>
        <p>
          Back to <Link to="/login">Sign in</Link>
        </p>
      </form>
    </section>
  );
}
