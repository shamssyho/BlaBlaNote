import { AuthUser } from '../../types/auth.types';

const ACCESS_TOKEN_KEY = 'blabla_note_access_token';
const USER_KEY = 'blabla_note_user';

export const tokenStorage = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  setAccessToken(token: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  clearAccessToken(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
  getUser(): AuthUser | null {
    const userJson = localStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  },
  setUser(user: AuthUser): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clearUser(): void {
    localStorage.removeItem(USER_KEY);
  },
};
