// 認証API呼び出し関数

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  email: string;
  password: string;
  confirmPassword?: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: error.message || 'ログインに失敗しました',
      };
    }

    const result = await response.json();
    
    // トークンをローカルストレージに保存
    if (result.token) {
      localStorage.setItem('auth_token', result.token);
      localStorage.setItem('user_email', data.email);
    }

    return {
      success: true,
      message: 'ログインに成功しました',
      token: result.token,
      user: result.user,
    };
  } catch (error) {
    return {
      success: false,
      message: 'ネットワークエラーが発生しました',
    };
  }
}

export async function signupUser(data: SignupRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: error.message || '登録に失敗しました',
      };
    }

    const result = await response.json();

    // トークンをローカルストレージに保存
    if (result.token) {
      localStorage.setItem('auth_token', result.token);
      localStorage.setItem('user_email', data.email);
    }

    return {
      success: true,
      message: '登録に成功しました',
      token: result.token,
      user: result.user,
    };
  } catch (error) {
    return {
      success: false,
      message: 'ネットワークエラーが発生しました',
    };
  }
}

export async function loginWithGoogle(): Promise<AuthResponse> {
  try {
    // Googleログイン処理
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return {
        success: false,
        message: 'Googleログインに失敗しました',
      };
    }

    const result = await response.json();

    if (result.token) {
      localStorage.setItem('auth_token', result.token);
      localStorage.setItem('user_email', result.user?.email);
    }

    return {
      success: true,
      message: 'Googleログインに成功しました',
      token: result.token,
      user: result.user,
    };
  } catch (error) {
    return {
      success: false,
      message: 'ネットワークエラーが発生しました',
    };
  }
}

export async function loginWithApple(): Promise<AuthResponse> {
  try {
    // Appleログイン処理
    const response = await fetch(`${API_BASE_URL}/auth/apple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return {
        success: false,
        message: 'Appleログインに失敗しました',
      };
    }

    const result = await response.json();

    if (result.token) {
      localStorage.setItem('auth_token', result.token);
      localStorage.setItem('user_email', result.user?.email);
    }

    return {
      success: true,
      message: 'Appleログインに成功しました',
      token: result.token,
      user: result.user,
    };
  } catch (error) {
    return {
      success: false,
      message: 'ネットワークエラーが発生しました',
    };
  }
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_email');
}
