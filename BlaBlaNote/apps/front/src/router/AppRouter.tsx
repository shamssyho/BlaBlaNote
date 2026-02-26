import { AppLayout } from '../layouts/AppLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { NoteDetailPage } from '../pages/NoteDetailPage';
import { NotesListPage } from '../pages/NotesListPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ProtectedRoute } from './ProtectedRoute';
import { matchPath, RouterProvider, usePathname } from './router';

function RoutedApp() {
  const path = usePathname();

  if (path === '/login') {
    return <LoginPage />;
  }

  if (path === '/register') {
    return <RegisterPage />;
  }

  if (path === '/') {
    return <LandingPage />;
  }

  if (path === '/dashboard') {
    return (
      <ProtectedRoute redirectTo="/login">
        <AppLayout>
          <DashboardPage />
        </AppLayout>
      </ProtectedRoute>
    );
  }

  if (path === '/notes') {
    return (
      <ProtectedRoute redirectTo="/login">
        <AppLayout>
          <NotesListPage />
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
