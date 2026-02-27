import { AppLayout } from '../layouts/AppLayout';
import { HomePage } from '../pages/Home';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { NoteDetailPage } from '../pages/NoteDetailPage';
import { NotesListPage } from '../pages/NotesListPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ProtectedRoute } from './ProtectedRoute';
import { matchPath, RouterProvider, usePathname } from './router';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { TermsPage } from '../pages/TermsPage';
import { TermsConsentPage } from '../pages/TermsConsentPage';
import { AdminUsersPage } from '../pages/AdminUsersPage';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { ROLES } from '../constants/auth';

function PlaceholderPage({ title }: { title: string }) {
  return (
    <section>
      <h1>{title}</h1>
      <p>This area is coming soon.</p>
    </section>
  );
}

function RoutedApp() {
  const path = usePathname();

  if (path === '/login') {
    return <LoginPage />;
  }

  if (path === '/register') {
    return <RegisterPage />;
  }

  if (path === '/forgot-password') {
    return <ForgotPasswordPage />;
  }

  if (path === '/reset-password') {
    return <ResetPasswordPage />;
  }

  if (path === '/terms') {
    return <TermsPage />;
  }

  if (path === '/terms-consent') {
    return (
      <ProtectedRoute redirectTo="/login">
        <TermsConsentPage />
      </ProtectedRoute>
    );
  }

  if (path === '/') {
    return <LandingPage />;
  }

  if (path === '/dashboard' || path === '/home') {
    return (
      <ProtectedRoute redirectTo="/login">
        <AppLayout>
          <HomePage />
        </AppLayout>
      </ProtectedRoute>
    );
  }

  if (path === '/notes' || path === '/notes/new') {
    return (
      <ProtectedRoute redirectTo="/login">
        <AppLayout>
          <NotesListPage />
        </AppLayout>
      </ProtectedRoute>
    );
  }

  if (path === '/profile') {
    return (
      <ProtectedRoute redirectTo="/login">
        <AppLayout>
          <PlaceholderPage title="Profile" />
        </AppLayout>
      </ProtectedRoute>
    );
  }

  if (path === '/settings') {
    return (
      <ProtectedRoute redirectTo="/login">
        <AppLayout>
          <PlaceholderPage title="Settings" />
        </AppLayout>
      </ProtectedRoute>
    );
  }


  if (path === '/admin') {
    return (
      <ProtectedRoute redirectTo="/login" requiredRole={ROLES.ADMIN}>
        <AdminDashboard />
      </ProtectedRoute>
    );
  }

  if (path === '/admin/users') {
    return (
      <ProtectedRoute redirectTo="/login" requiredRole={ROLES.ADMIN}>
        <AppLayout>
          <AdminUsersPage />
        </AppLayout>
      </ProtectedRoute>
    );
  }

  const noteMatch = matchPath('/notes/:id', path);
  if (noteMatch) {
    return (
      <ProtectedRoute redirectTo="/login">
        <AppLayout>
          <NoteDetailPage noteId={noteMatch.id} />
        </AppLayout>
      </ProtectedRoute>
    );
  }

  return <LandingPage />;
}

export function AppRouter() {
  return (
    <RouterProvider>
      <RoutedApp />
    </RouterProvider>
  );
}
