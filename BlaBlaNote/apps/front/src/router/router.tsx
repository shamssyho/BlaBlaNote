import {
  createContext,
  MouseEvent,
  ReactNode,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface RouterContextValue {
  path: string;
  navigate: (to: string, options?: { replace?: boolean }) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

export function RouterProvider({ children }: PropsWithChildren) {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handler = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handler);

    return () => {
      window.removeEventListener('popstate', handler);
    };
  }, []);

  const value = useMemo<RouterContextValue>(
    () => ({
      path,
      navigate(to, options) {
        if (options?.replace) {
          window.history.replaceState({}, '', to);
        } else {
          window.history.pushState({}, '', to);
        }
        setPath(to);
      },
    }),
    [path]
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useNavigate() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useNavigate must be used inside RouterProvider');
  }

  return context.navigate;
}

export function usePathname() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('usePathname must be used inside RouterProvider');
  }

  return context.path;
}

interface LinkProps {
  to: string;
  className?: string;
  children: ReactNode;
}

export function Link({ to, className, children }: LinkProps) {
  const navigate = useNavigate();

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    navigate(to);
  }

  return (
    <a href={to} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

interface NavLinkProps extends LinkProps {
  activeClassName?: string;
}

export function NavLink({ to, className, activeClassName = 'active', children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === to;
  const computedClassName = [className, isActive ? activeClassName : ''].filter(Boolean).join(' ');

  return (
    <Link to={to} className={computedClassName}>
      {children}
    </Link>
  );
}

export function matchPath(pattern: string, pathname: string): Record<string, string> | null {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = pathname.split('/').filter(Boolean);

  if (patternParts.length !== pathParts.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let index = 0; index < patternParts.length; index += 1) {
    const patternPart = patternParts[index];
    const pathPart = pathParts[index];

    if (patternPart.startsWith(':')) {
      params[patternPart.slice(1)] = decodeURIComponent(pathPart);
      continue;
    }

    if (patternPart !== pathPart) {
      return null;
    }
  }

  return params;
}
