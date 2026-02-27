export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'DELETED';
export type UserRole = 'ADMIN' | 'USER';

export interface AdminUserItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string | null;
  notesCount: number;
  plan?: string | null;
  priceCents?: number | null;
  currency?: string | null;
  billingStatus?: string | null;
  refreshTokens: {
    activeCount: number;
    lastIssuedAt?: string | null;
    maxExpiresAt?: string | null;
  };
  termsAcceptedAt?: string | null;
  termsVersion?: string | null;
}

export interface AdminUsersResponse {
  items: AdminUserItem[];
  page: number;
  pageSize: number;
  total: number;
}

export interface AdminUsersQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: UserStatus[];
  role?: UserRole | '';
  hasActiveRefreshTokens?: boolean;
  createdFrom?: string;
  createdTo?: string;
  sortBy?: 'createdAt' | 'lastLoginAt' | 'email' | 'price' | 'notesCount';
  sortDir?: 'asc' | 'desc';
}
