import { createContext, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { authApi } from '../../api/auth.api';
import { LoginPayload, RegisterPayload } from '../../types/auth.types';
import { tokenStorage } from './token.storage';

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    setIsAuthenticated(Boolean(token));
    setIsLoading(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      isLoading,
      async login(payload) {
        const response = await authApi.login(payload);
        tokenStorage.setAccessToken(response.access_token);
        setIsAuthenticated(true);
      },
      async register(payload) {
        await authApi.register(payload);
      },
      logout() {
        tokenStorage.clearAccessToken();
        setIsAuthenticated(false);
      },
    }),
    [isAuthenticated, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
