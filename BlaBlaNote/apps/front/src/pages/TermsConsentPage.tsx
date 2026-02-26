import { useState } from 'react';
import { authApi } from '../api/auth.api';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from '../router/router';

export function TermsConsentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onAccept() {
    if (!accepted || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await authApi.acceptTerms('v1.0');
      navigate('/dashboard', { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-form">
        <h1>Accept Terms</h1>
        <p>
          Welcome {user?.firstName}. You need to accept the latest terms to continue.
        </p>
        <label>
          <input
            type="checkbox"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
          />{' '}
          I accept the Terms & Conditions (v1.0)
        </label>
        <button type="button" disabled={!accepted || isSubmitting} onClick={onAccept}>
          {isSubmitting ? 'Saving...' : 'Continue'}
        </button>
      </div>
    </section>
  );
}
