import { PropsWithChildren, useEffect } from 'react';
import { Loader } from '../components/ui/Loader';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, usePathname } from './router';

import type { AppRole } from '../constants/auth';

interface ProtectedRouteProps extends PropsWithChildren {
  redirectTo: string;
  requiredRole?: AppRole;
}

export function ProtectedRoute({
  children,
  redirectTo,
  requiredRole,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(redirectTo, { replace: true });
      return;
    }

    if (
      !isLoading &&
      isAuthenticated &&
      !user?.termsAcceptedAt &&
      pathname !== '/terms-consent'
    ) {
      navigate('/terms-consent', { replace: true });
      return;
    }

    if (!isLoading && isAuthenticated && requiredRole && user?.role !== requiredRole) {
      navigate('/home', { replace: true });
    }
  }, [
    isAuthenticated,
    isLoading,
    navigate,
    pathname,
    redirectTo,
    requiredRole,
    user?.role,
    user?.termsAcceptedAt,
  ]);

  if (isLoading || !isAuthenticated) {
    return <Loader label="Checking session..." />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Loader label="Redirecting..." />;
  }

  return children;
}
