import axios, { AxiosError } from 'axios';
import { tokenStorage } from '../modules/auth/token.storage';
import { ApiError } from '../types/api.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export const http = axios.create({
  baseURL: API_BASE_URL,
});

http.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
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
