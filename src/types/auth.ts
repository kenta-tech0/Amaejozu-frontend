// ユーザー情報
export interface User {
  id: string;
  email: string;
  nickname: string;
}

// ログインリクエスト
export interface LoginRequest {
  email: string;
  password: string;
}

// サインアップリクエスト
export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

// 認証レスポンス
export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

// エラーレスポンス
export interface ApiError {
  detail: string;
}
