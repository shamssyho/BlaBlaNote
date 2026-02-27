import { http } from './http';
import { AdminUsersQuery, AdminUsersResponse } from '../types/admin-users.types';

function buildParams(query: AdminUsersQuery) {
  const params = new URLSearchParams();

  if (query.page) params.set('page', String(query.page));
  if (query.pageSize) params.set('pageSize', String(query.pageSize));
  if (query.search) params.set('search', query.search);
  if (query.role) params.set('role', query.role);
  if (query.createdFrom) params.set('createdFrom', query.createdFrom);
  if (query.createdTo) params.set('createdTo', query.createdTo);
  if (typeof query.hasActiveRefreshTokens === 'boolean') {
    params.set('hasActiveRefreshTokens', String(query.hasActiveRefreshTokens));
  }
  if (query.sortBy) params.set('sortBy', query.sortBy);
  if (query.sortDir) params.set('sortDir', query.sortDir);

  query.status?.forEach((status) => params.append('status', status));

  return params;
}

export const adminUsersApi = {
  getUsers(query: AdminUsersQuery) {
    const params = buildParams(query);

    return http
      .get<AdminUsersResponse>(`/admin/users?${params.toString()}`)
      .then((res) => res.data);
  },
};
