import { http } from './http';
import {
  AuthTokenResponse,
  LoginPayload,
  RegisterPayload,
  AuthUser,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from '../types/auth.types';

export const authApi = {
  login(payload: LoginPayload) {
    return http
      .post<AuthTokenResponse>('/auth/login', payload)
      .then((res) => res.data);
  },
  register(payload: RegisterPayload) {
    return http
      .post<AuthUser>('/auth/register', payload)
      .then((res) => res.data);
  },
  refresh() {
    return http.post<{ access_token: string }>('/auth/refresh').then((res) => res.data);
  },
  logout() {
    return http.post<{ success: boolean }>('/auth/logout').then((res) => res.data);
  },
  forgotPassword(payload: ForgotPasswordPayload) {
    return http
      .post<{ message: string }>('/auth/forgot-password', payload)
      .then((res) => res.data);
  },
  resetPassword(payload: ResetPasswordPayload) {
    return http
      .post<{ success: boolean }>('/auth/reset-password', payload)
      .then((res) => res.data);
  },
  acceptTerms(termsVersion = 'v1.0') {
    return http
      .post<AuthUser>('/users/me/accept-terms', { termsVersion })
      .then((res) => res.data);
  },
};
