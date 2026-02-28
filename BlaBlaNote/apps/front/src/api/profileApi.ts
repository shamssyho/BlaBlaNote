import { http } from './http';
import {
  ChangePasswordPayload,
  ProfileUser,
  UpdateProfilePayload,
} from '../types/profile.types';

export const profileApi = {
  getMe() {
    return http.get<ProfileUser>('/me').then((res) => res.data);
  },
  updateMe(payload: UpdateProfilePayload) {
    return http.patch<ProfileUser>('/me', payload).then((res) => res.data);
  },
  changePassword(payload: ChangePasswordPayload) {
    return http.patch<{ success: boolean }>('/me/password', payload).then((res) => res.data);
  },
  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    return http
      .post<ProfileUser>('/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data);
  },
  deleteMe() {
    return http.delete<{ success: boolean; message: string }>('/me').then((res) => res.data);
  },
};
