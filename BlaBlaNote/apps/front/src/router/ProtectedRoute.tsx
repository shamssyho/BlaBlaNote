import { PropsWithChildren, useEffect } from 'react';
import { Loader } from '../components/ui/Loader';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, usePathname } from './router';

interface ProtectedRouteProps extends PropsWithChildren {
  redirectTo: string;
}

export function ProtectedRoute({ children, redirectTo }: ProtectedRouteProps) {
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
    }
  }, [isAuthenticated, isLoading, navigate, pathname, redirectTo, user?.termsAcceptedAt]);

  if (isLoading || !isAuthenticated) {
    return <Loader label="Checking session..." />;
  }

  return <>{children}</>;
}
