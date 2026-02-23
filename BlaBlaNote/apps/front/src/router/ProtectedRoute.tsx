import { PropsWithChildren, useEffect } from 'react';
import { Loader } from '../components/ui/Loader';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from './router';

interface ProtectedRouteProps extends PropsWithChildren {
  redirectTo: string;
}

export function ProtectedRoute({ children, redirectTo }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo]);

  if (isLoading || !isAuthenticated) {
    return <Loader label="Checking session..." />;
  }

  return <>{children}</>;
}
