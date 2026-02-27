import { useEffect, useMemo, useState } from 'react';
import { adminUsersApi } from '../api/adminUsers.api';
import {
  AdminUserItem,
  AdminUsersQuery,
  UserRole,
  UserStatus,
} from '../types/admin-users.types';

const USER_STATUSES: UserStatus[] = ['ACTIVE', 'SUSPENDED', 'PENDING', 'DELETED'];
const SORT_FIELDS: AdminUsersQuery['sortBy'][] = [
  'createdAt',
  'lastLoginAt',
  'email',
  'price',
  'notesCount',
];

function formatDate(value?: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

function formatPrice(priceCents?: number | null, currency?: string | null) {
  if (priceCents === null || priceCents === undefined) return '—';
  const code = currency || 'USD';
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: code,
  }).format(priceCents / 100);
}

export function AdminUsersPage() {
  const [items, setItems] = useState<AdminUserItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState<AdminUsersQuery>({
    page: 1,
    pageSize: 20,
    sortBy: 'createdAt',
    sortDir: 'desc',
    status: [],
  });

  useEffect(() => {
    setLoading(true);
    setError(null);

    adminUsersApi
      .getUsers(query)
      .then((response) => {
        setItems(response.items);
        setTotal(response.total);
      })
      .catch((apiError: { message?: string }) => {
        setError(apiError.message ?? 'Failed to load users.');
      })
      .finally(() => setLoading(false));
  }, [query]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / (query.pageSize || 20))),
    [query.pageSize, total]
  );

  const setPartialQuery = (next: Partial<AdminUsersQuery>) => {
    setQuery((prev) => ({ ...prev, ...next, page: 1 }));
  };

  const toggleStatus = (status: UserStatus) => {
    const current = query.status ?? [];
    const exists = current.includes(status);
    const nextStatuses = exists
      ? current.filter((item) => item !== status)
      : [...current, status];

    setPartialQuery({ status: nextStatuses });
  };

  const clearFilters = () => {
    setQuery({
      page: 1,
      pageSize: query.pageSize,
      sortBy: query.sortBy,
      sortDir: query.sortDir,
      status: [],
    });
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Users</h1>
        <p className="text-sm text-slate-600">Admin-only user management and token metadata.</p>
      </div>

      <form className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-2 xl:grid-cols-4" onSubmit={(e) => e.preventDefault()} aria-label="Users filters">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Search</span>
          <input
            type="text"
            value={query.search ?? ''}
            onChange={(e) => setPartialQuery({ search: e.target.value || undefined })}
            placeholder="Email, first name, last name"
            className="rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <fieldset className="flex flex-col gap-1 text-sm">
          <legend className="font-medium text-slate-700">Status</legend>
          <div className="flex flex-wrap gap-2">
            {USER_STATUSES.map((status) => (
              <label key={status} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-2 py-1">
                <input
                  type="checkbox"
                  checked={(query.status ?? []).includes(status)}
                  onChange={() => toggleStatus(status)}
                />
                <span>{status}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Role</span>
          <select
            value={query.role ?? ''}
            onChange={(e) => setPartialQuery({ role: (e.target.value as UserRole) || '' })}
            className="rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="">All roles</option>
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER</option>
          </select>
        </label>

        <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={query.hasActiveRefreshTokens === true}
            onChange={(e) =>
              setPartialQuery({
                hasActiveRefreshTokens: e.target.checked ? true : undefined,
              })
            }
          />
          Has active refresh tokens
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Created from</span>
          <input
            type="date"
            value={query.createdFrom ?? ''}
            onChange={(e) => setPartialQuery({ createdFrom: e.target.value || undefined })}
            className="rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Created to</span>
          <input
            type="date"
            value={query.createdTo ?? ''}
            onChange={(e) => setPartialQuery({ createdTo: e.target.value || undefined })}
            className="rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Sort by</span>
          <select
            value={query.sortBy}
            onChange={(e) => setQuery((prev) => ({ ...prev, sortBy: e.target.value as AdminUsersQuery['sortBy'] }))}
            className="rounded-lg border border-slate-300 px-3 py-2"
          >
            {SORT_FIELDS.map((field) => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Direction</span>
          <button
            type="button"
            onClick={() =>
              setQuery((prev) => ({
                ...prev,
                sortDir: prev.sortDir === 'asc' ? 'desc' : 'asc',
              }))
            }
            className="rounded-lg border border-slate-300 px-3 py-2 text-left"
          >
            {query.sortDir?.toUpperCase()}
          </button>
        </label>

        <div className="md:col-span-2 xl:col-span-4">
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium"
          >
            Clear filters
          </button>
        </div>
      </form>

      {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">{error}</div> : null}

      {loading ? <p className="text-slate-600">Loading users...</p> : null}

      {!loading && items.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-600">No users found for the selected filters.</div>
      ) : null}

      {!loading && items.length > 0 ? (
        <>
          <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white md:block">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Plan / Price</th>
                  <th className="px-4 py-3">Notes</th>
                  <th className="px-4 py-3">Tokens</th>
                  <th className="px-4 py-3">Last login</th>
                  <th className="px-4 py-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {items.map((user) => (
                  <tr key={user.id} className="border-t border-slate-100">
                    <td className="px-4 py-3">{`${user.firstName} ${user.lastName}`}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.role}</td>
                    <td className="px-4 py-3">{user.status}</td>
                    <td className="px-4 py-3">{`${user.plan || '—'} / ${formatPrice(user.priceCents, user.currency)}`}</td>
                    <td className="px-4 py-3">{user.notesCount}</td>
                    <td className="px-4 py-3" title={`Last issued: ${formatDate(user.refreshTokens.lastIssuedAt)}`}>
                      {user.refreshTokens.activeCount}
                    </td>
                    <td className="px-4 py-3">{formatDate(user.lastLoginAt)}</td>
                    <td className="px-4 py-3">{formatDate(user.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {items.map((user) => (
              <article key={user.id} className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 text-sm">
                <h2 className="font-semibold text-slate-900">{`${user.firstName} ${user.lastName}`}</h2>
                <p>{user.email}</p>
                <p>Role: {user.role}</p>
                <p>Status: {user.status}</p>
                <p>Plan: {user.plan || '—'} ({formatPrice(user.priceCents, user.currency)})</p>
                <p>Notes: {user.notesCount}</p>
                <p>Active refresh tokens: {user.refreshTokens.activeCount}</p>
                <p>Last login: {formatDate(user.lastLoginAt)}</p>
                <p>Created: {formatDate(user.createdAt)}</p>
              </article>
            ))}
          </div>
        </>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm">
        <p>
          Page {query.page} of {totalPages} • {total} users
        </p>
        <div className="flex items-center gap-2">
          <label>
            <span className="mr-2">Page size</span>
            <select
              value={query.pageSize}
              onChange={(e) => setQuery((prev) => ({ ...prev, pageSize: Number(e.target.value), page: 1 }))}
              className="rounded-lg border border-slate-300 px-2 py-1"
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => setQuery((prev) => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }))}
            disabled={(query.page || 1) <= 1}
            className="rounded-lg border border-slate-300 px-3 py-1 disabled:opacity-50"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => setQuery((prev) => ({ ...prev, page: Math.min(totalPages, (prev.page || 1) + 1) }))}
            disabled={(query.page || 1) >= totalPages}
            className="rounded-lg border border-slate-300 px-3 py-1 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
