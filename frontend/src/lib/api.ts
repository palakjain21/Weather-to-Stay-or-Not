// Base API configuration and utilities
const API_BASE_URL = 'http://localhost:4000';

export const getBaseUrl = () => {
  return API_BASE_URL;
};

export interface ApiError {
  error: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
}

export const buildQueryString = (params: Record<string, string | number | boolean | (string | number)[]>): string => {
  const validParams = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}=${value.join(',')}`;
      }
      return `${key}=${encodeURIComponent(value)}`;
    })
    .join('&');

  return validParams ? `?${validParams}` : '';
};

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${getBaseUrl()}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.error || 'An error occurred');
  }

  return response.json();
}
