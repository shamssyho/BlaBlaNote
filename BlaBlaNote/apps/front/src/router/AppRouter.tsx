import { AppLayout } from '../layouts/AppLayout';
import { DashboardPage } from '../pages/DashboardPage';
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

  if (path === '/' || path === '/dashboard') {
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

  return <LoginPage />;
}

export function AppRouter() {
  return (
    <RouterProvider>
      <RoutedApp />
    </RouterProvider>
  );
}
