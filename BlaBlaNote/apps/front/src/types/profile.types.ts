export interface ProfileUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isBlocked: boolean;
  avatarUrl: string | null;
  language: string;
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  language?: string;
  theme?: 'light' | 'dark';
  notificationsEnabled?: boolean;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
