import { AppLayout } from '../layouts/AppLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { ROLES } from '../constants/auth';
import { HomePage } from '../pages/Home';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { NoteDetailPage } from '../pages/NoteDetailPage';
import { NotesListPage } from '../pages/NotesListPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { ProjectDetailPage } from '../pages/ProjectDetailPage';
import { ProtectedRoute } from './ProtectedRoute';
import { matchPath, RouterProvider, usePathname } from './router';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { TermsPage } from '../pages/TermsPage';
import { TermsConsentPage } from '../pages/TermsConsentPage';
import { AdminUsersPage } from '../pages/AdminUsersPage';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminPlaceholderPage } from '../pages/admin/AdminPlaceholderPage';
import { BlogListPage } from '../pages/BlogListPage';
import { BlogDetailPage } from '../pages/BlogDetailPage';
import { AdminBlogPage } from '../pages/admin/AdminBlogPage';
import { AdminBlogCategoriesPage } from '../pages/admin/AdminBlogCategoriesPage';
import { ProfilePage } from '../pages/ProfilePage';
import { SettingsPage } from '../pages/SettingsPage';
import { TagsPage } from '../pages/TagsPage';

function renderAdminPage(path: string) {
  if (path === '/admin') {
    return <AdminDashboard />;
  }

  if (path === '/admin/users') {
    return <AdminUsersPage />;
  }

  if (path === '/admin/notes') {
    return (
      <AdminPlaceholderPage
        title="Notes Monitoring"
        description="Track note activity, identify usage trends, and prepare analytics rollouts."
      />
    );
  }

  if (path === '/admin/blog') {
    return <AdminBlogPage />;
  }

  if (path === '/admin/blog/categories') {
    return <AdminBlogCategoriesPage />;
  }

  if (path === '/admin/billing') {
    return (
      <AdminPlaceholderPage
        title="Subscription & Billing"
        description="Review plans and revenue analytics in this dedicated billing workspace."
      />
    );
  }

  return <AdminDashboard />;
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


  if (path === '/blog') {
    return (
      <AppLayout>
        <BlogListPage />
      </AppLayout>
    );
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


  if (path === '/projects') {
    return (
      <ProtectedRoute redirectTo="/login">
        <AppLayout>
          <ProjectsPage />
        </AppLayout>
      </ProtectedRoute>
    );
  }


  if (path === '/tags') {
    return (
      <ProtectedRoute redirectTo="/login">
        <AppLayout>
          <TagsPage />
        </AppLayout>
      </ProtectedRoute>
    );
  }
  if (path === '/profile') {
    return (
      <ProtectedRoute redirectTo="/login">
        <AppLayout>
          <ProfilePage />
        </AppLayout>
      </ProtectedRoute>
    );
  }

  if (path === '/settings') {
    return (
      <ProtectedRoute redirectTo="/login">
        <AppLayout>
          <SettingsPage />
        </AppLayout>
      </ProtectedRoute>
    );
  }

  if (path.startsWith('/admin')) {
    return (
      <ProtectedRoute redirectTo="/login" requiredRole={ROLES.ADMIN}>
        <AdminLayout>{renderAdminPage(path)}</AdminLayout>
      </ProtectedRoute>
    );
  }


  const blogMatch = matchPath('/blog/:slug', path);
  if (blogMatch) {
    return (
      <AppLayout>
        <BlogDetailPage slug={blogMatch.slug} />
      </AppLayout>
    );
  }

  const projectMatch = matchPath('/projects/:id', path);
  if (projectMatch) {
    return (
      <ProtectedRoute redirectTo="/login">
        <AppLayout>
          <ProjectDetailPage projectId={projectMatch.id} />
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
