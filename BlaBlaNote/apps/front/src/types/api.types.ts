export interface ApiError {
  message: string;
  statusCode?: number;
  details?: unknown;
}

export interface ApiResponse<T> {
  data: T;
}

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';
