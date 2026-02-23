import { http } from './http';
import { AuthTokenResponse, LoginPayload, RegisterPayload } from '../types/auth.types';

export const authApi = {
  login(payload: LoginPayload) {
    return http.post<AuthTokenResponse>('/auth/login', payload).then((res) => res.data);
  },
  register(payload: RegisterPayload) {
    return http.post('/auth/register', payload).then((res) => res.data);
  },
};
