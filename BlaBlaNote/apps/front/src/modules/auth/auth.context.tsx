import { createContext, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { authApi } from '../../api/auth.api';
import {
  LoginPayload,
  RegisterPayload,
  AuthUser,
} from '../../types/auth.types';
import { tokenStorage } from './token.storage';

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    const user = tokenStorage.getUser();
    setIsAuthenticated(Boolean(token));
    setUser(user);
    setIsLoading(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      isLoading,
      user,
      async login(payload) {
        const response = await authApi.login(payload);
        tokenStorage.setAccessToken(response.access_token);
        tokenStorage.setUser(response.user);
        setUser(response.user);
        setIsAuthenticated(true);
      },
      async register(payload) {
        const user = await authApi.register(payload);
        // Auto-login after successful registration
        const response = await authApi.login({
          email: payload.email,
          password: payload.password,
        });
        tokenStorage.setAccessToken(response.access_token);
        tokenStorage.setUser(response.user);
        setUser(response.user);
        setIsAuthenticated(true);
      },
      logout() {
        tokenStorage.clearAccessToken();
        tokenStorage.clearUser();
        setUser(null);
        setIsAuthenticated(false);
      },
    }),
    [isAuthenticated, isLoading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
