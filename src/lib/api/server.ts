/**
 * API Client for Server Components / Server Actions / Route Handlers
 *
 * Usage:
 *   import { apiServer } from '@/lib/api/server';
 *   const data = await apiServer.get('/api/products', { cookie: cookieHeader });
 */

import { ApiError, parseErrorResponse } from './errors';

// Internal URL for server-to-server communication (within Docker network)
const INTERNAL_API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type ServerRequestOptions = {
  headers?: Record<string, string>;
  cookie?: string; // Forward cookies from incoming request
  signal?: AbortSignal;
};

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options: ServerRequestOptions = {}
): Promise<T> {
  const url = `${INTERNAL_API_URL}${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Forward cookies if provided
  if (options.cookie) {
    headers['Cookie'] = options.cookie;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal: options.signal,
    // No credentials: 'include' on server side - use explicit Cookie header instead
  });

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const apiServer = {
  get<T>(path: string, options?: ServerRequestOptions): Promise<T> {
    return request<T>('GET', path, undefined, options);
  },

  post<T>(path: string, body?: unknown, options?: ServerRequestOptions): Promise<T> {
    return request<T>('POST', path, body, options);
  },

  put<T>(path: string, body?: unknown, options?: ServerRequestOptions): Promise<T> {
    return request<T>('PUT', path, body, options);
  },

  patch<T>(path: string, body?: unknown, options?: ServerRequestOptions): Promise<T> {
    return request<T>('PATCH', path, body, options);
  },

  delete<T>(path: string, options?: ServerRequestOptions): Promise<T> {
    return request<T>('DELETE', path, undefined, options);
  },
};

/**
 * Helper to get cookies from Next.js headers
 *
 * Usage in Server Actions:
 *   import { cookies } from 'next/headers';
 *   const cookieStore = await cookies();
 *   const data = await apiServer.get('/api/me', { cookie: getCookieString(cookieStore) });
 */
export function getCookieString(cookieStore: { getAll: () => Array<{ name: string; value: string }> }): string {
  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');
}

export { ApiError };
