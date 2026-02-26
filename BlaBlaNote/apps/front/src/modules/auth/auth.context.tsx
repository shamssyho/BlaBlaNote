import { createContext, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { authApi } from '../../api/auth.api';
import {
  LoginPayload,
  RegisterPayload,
  AuthUser,
} from '../../types/auth.types';
import { tokenStorage } from './token.storage';
import { registerAuthLogoutHandler } from '../../api/http';

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const persistedUser = tokenStorage.getUser();
    setUser(persistedUser);

    authApi
      .refresh()
      .then(({ access_token }) => {
        tokenStorage.setAccessToken(access_token);
        setIsAuthenticated(true);
      })
      .catch(() => {
        tokenStorage.clearAccessToken();
        setIsAuthenticated(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    registerAuthLogoutHandler(() => {
      tokenStorage.clearAccessToken();
      tokenStorage.clearUser();
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/login';
    });
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
        await authApi.register(payload);
        const response = await authApi.login({
          email: payload.email,
          password: payload.password,
        });
        tokenStorage.setAccessToken(response.access_token);
        tokenStorage.setUser(response.user);
        setUser(response.user);
        setIsAuthenticated(true);
      },
      async logout() {
        await authApi.logout().catch(() => undefined);
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
