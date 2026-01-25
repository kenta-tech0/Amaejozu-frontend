'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { apiClient, ApiError } from '@/lib/api';

// User type - expand as needed based on backend response
export interface User {
  id: string;
  email: string;
  name?: string;
}

// Auth state
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Auth result type
interface AuthResult {
  success: boolean;
  error?: string;
}

// Auth context value
interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Token storage key
const TOKEN_KEY = 'auth_token';

// API response types
interface LoginResponse {
  user: User;
  token: string;
  message?: string;
}

interface SignupResponse {
  user: User;
  token: string;
  message?: string;
}

interface MeResponse {
  user: User;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: false, // Start as loading to check auth on mount
    isAuthenticated: false,
  });

  // Check if user is authenticated (on mount and after actions)
  const checkAuth = useCallback(async () => {
    try {
      const response = await apiClient.get<MeResponse>('/auth/me');
      setState({
        user: response.user,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch {
      // 401 means not authenticated - this is expected
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  // Login
  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', {
        email,
        password,
      });

      // トークンをlocalStorageに保存
      localStorage.setItem(TOKEN_KEY, response.token);

      setState({
        user: response.user,
        isLoading: false,
        isAuthenticated: true,
      });

      return { success: true };
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));

      if (error instanceof ApiError) {
        return { success: false, error: error.message };
      }
      return { success: false, error: 'ログインに失敗しました。' };
    }
  }, []);

  // Signup
  const signup = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await apiClient.post<SignupResponse>('/auth/signup', {
        email,
        password,
      });

      // トークンをlocalStorageに保存
      localStorage.setItem(TOKEN_KEY, response.token);

      setState({
        user: response.user,
        isLoading: false,
        isAuthenticated: true,
      });

      return { success: true };
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));

      if (error instanceof ApiError) {
        return { success: false, error: error.message };
      }
      return { success: false, error: 'アカウント登録に失敗しました。' };
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore logout errors - clear state anyway
    }

    // トークンをlocalStorageから削除
    localStorage.removeItem(TOKEN_KEY);

    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  // Check auth on mount
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      // トークンがない場合は認証チェックをスキップ
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        if (isMounted) {
          setState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
        return;
      }

      try {
        const response = await apiClient.get<MeResponse>('/auth/me');
        if (isMounted) {
          setState({
            user: response.user,
            isLoading: false,
            isAuthenticated: true,
          });
        }
      } catch {
        // トークンが無効な場合は削除
        localStorage.removeItem(TOKEN_KEY);
        if (isMounted) {
          setState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
