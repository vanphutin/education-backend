export interface MovieView {
  id: string;
  title: string;
  durationMinutes: number;
}

export interface ApiError {
  code: 'INVALID_REQUEST' | 'UPSTREAM_TIMEOUT' | 'UPSTREAM_UNAVAILABLE' | 'INTERNAL_ERROR';
  message: string;
  requestId: string;
  retryable: boolean;
}

export function errorBody(error: ApiError) {
  return { error };
}
