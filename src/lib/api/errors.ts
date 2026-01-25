/**
 * API Error handling utilities
 */

export interface ApiErrorResponse {
  detail: string;
  code?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly code?: string;
  public readonly errors?: Array<{ field: string; message: string }>;

  constructor(status: number, detail: string, code?: string, errors?: Array<{ field: string; message: string }>) {
    super(detail);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.errors = errors;
  }

  /**
   * Check if the error is an authentication error (401)
   */
  isUnauthorized(): boolean {
    return this.status === 401;
  }

  /**
   * Check if the error is a forbidden error (403)
   */
  isForbidden(): boolean {
    return this.status === 403;
  }

  /**
   * Check if the error is a not found error (404)
   */
  isNotFound(): boolean {
    return this.status === 404;
  }

  /**
   * Check if the error is a validation error (422)
   */
  isValidationError(): boolean {
    return this.status === 422;
  }

  /**
   * Check if the error is a rate limit error (429)
   */
  isRateLimited(): boolean {
    return this.status === 429;
  }

  /**
   * Check if the error is a server error (5xx)
   */
  isServerError(): boolean {
    return this.status >= 500;
  }
}

/**
 * Parse error response from API
 */
export async function parseErrorResponse(response: Response): Promise<ApiError> {
  let detail = 'An unexpected error occurred';
  let code: string | undefined;
  let errors: Array<{ field: string; message: string }> | undefined;

  try {
    const data: ApiErrorResponse = await response.json();
    detail = data.detail || detail;
    code = data.code;
    errors = data.errors;
  } catch {
    // If JSON parsing fails, use status text
    detail = response.statusText || detail;
  }

  return new ApiError(response.status, detail, code, errors);
}

/**
 * User-friendly error messages for common scenarios
 */
export function getErrorMessage(error: ApiError): string {
  if (error.isUnauthorized()) {
    return 'ログインが必要です。再度ログインしてください。';
  }
  if (error.isForbidden()) {
    return 'この操作を行う権限がありません。';
  }
  if (error.isNotFound()) {
    return 'お探しのリソースが見つかりませんでした。';
  }
  if (error.isRateLimited()) {
    return 'リクエストが多すぎます。しばらく待ってから再度お試しください。';
  }
  if (error.isServerError()) {
    return 'サーバーエラーが発生しました。しばらく待ってから再度お試しください。';
  }
  return error.message;
}
