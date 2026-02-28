import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from '../router/router';
import { useAuth } from '../hooks/useAuth';
import { ApiError } from '../types/api.types';

export function RegisterPage() {
  const { t } = useTranslation('auth');
  const { register } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await register({
        firstName,
        lastName,
        email,
        password,
        termsAccepted,
        termsVersion: 'v1.0',
      });
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
        <h1>{t('register.title')}</h1>
        <input value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder={t('register.firstName')} required />
        <input value={lastName} onChange={(event) => setLastName(event.target.value)} placeholder={t('register.lastName')} required />
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t('register.email')} required />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder={t('register.password')}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(event) => setTermsAccepted(event.target.checked)}
            required
          />{' '}
          {t('register.acceptTerms', { terms: t('register.terms') })} <Link to="/terms">{t('register.terms')}</Link>
        </label>
        {error ? <p className="error-text">{error}</p> : null}
        <button type="submit" disabled={isSubmitting || !termsAccepted}>
          {isSubmitting ? t('register.submitting') : t('register.submit')}
        </button>
        <p>
          {t('register.alreadyRegistered')} <Link to="/login">{t('register.signIn')}</Link>
        </p>
      </form>
    </section>
  );
}
