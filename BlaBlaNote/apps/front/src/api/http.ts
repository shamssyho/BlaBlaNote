import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { tokenStorage } from '../modules/auth/token.storage';
import { ApiError } from '../types/api.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let refreshPromise: Promise<string> | null = null;
let logoutHandler: (() => void) | null = null;

export function registerAuthLogoutHandler(handler: () => void) {
  logoutHandler = handler;
}

http.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = http
      .post<{ access_token: string }>('/auth/refresh', null, {
        headers: { 'x-skip-auth-retry': '1' },
      })
      .then((res) => {
        tokenStorage.setAccessToken(res.data.access_token);
        return res.data.access_token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalConfig = (error.config || {}) as AxiosRequestConfig & {
      _retry?: boolean;
    };

    const skipRetry = originalConfig.headers?.['x-skip-auth-retry'];

    if (
      error.response?.status === 401 &&
      !originalConfig._retry &&
      !skipRetry
    ) {
      originalConfig._retry = true;

      try {
        const token = await refreshAccessToken();
        originalConfig.headers = {
          ...(originalConfig.headers || {}),
          Authorization: `Bearer ${token}`,
        };

        return http.request(originalConfig);
      } catch {
        tokenStorage.clearAccessToken();
        logoutHandler?.();
      }
    }

    const responseData = error.response?.data as
      | { message?: string; statusCode?: number }
      | undefined;

    const apiError: ApiError = {
      message: responseData?.message ?? error.message,
      statusCode: responseData?.statusCode ?? error.response?.status,
      details: error.response?.data,
    };

    return Promise.reject(apiError);
  }
);
