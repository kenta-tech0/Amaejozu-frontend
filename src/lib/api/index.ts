/**
 * API module exports
 *
 * Usage:
 *   // Client Components (browser)
 *   import { apiClient } from '@/lib/api';
 *
 *   // Server Components / Actions (server)
 *   import { apiServer, getCookieString } from '@/lib/api';
 *
 *   // Error handling
 *   import { ApiError, getErrorMessage } from '@/lib/api';
 */

export { apiClient } from './client';
export { apiServer, getCookieString } from './server';
export { ApiError, getErrorMessage, type ApiErrorResponse } from './errors';
