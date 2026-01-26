'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { authApi, ApiClientError, tokenManager } from '@/lib/api-client';

// User type - expand as needed based on backend response
export interface User {
  id: string;
  email: string;
  nickname?: string;
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
  signup: (email: string, password: string, nickname?: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: false,
    isAuthenticated: false,
  });

  // Check if user is authenticated (on mount and after actions)
  const checkAuth = useCallback(async () => {
    try {
      const user = await authApi.me();
      setState({
        user,
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
      const response = await authApi.login(email, password);
      // authApi.loginが内部でトークンを保存するため、ここでの保存は不要

      if (!response.user) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return { success: false, error: 'ユーザー情報の取得に失敗しました。' };
      }

      setState({
        user: response.user,
        isLoading: false,
        isAuthenticated: true,
      });

      return { success: true };
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));

      if (error instanceof ApiClientError) {
        return { success: false, error: error.message };
      }
      return { success: false, error: 'ログインに失敗しました。' };
    }
  }, []);

  // Signup
  const signup = useCallback(async (email: string, password: string, nickname?: string): Promise<AuthResult> => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await authApi.signup(email, password, nickname || email.split('@')[0]);
      // authApi.signupが内部でトークンを保存するため、ここでの保存は不要

      if (!response.user) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return { success: false, error: 'ユーザー情報の取得に失敗しました。' };
      }

      setState({
        user: response.user,
        isLoading: false,
        isAuthenticated: true,
      });

      return { success: true };
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));

      if (error instanceof ApiClientError) {
        return { success: false, error: error.message };
      }
      return { success: false, error: 'アカウント登録に失敗しました。' };
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    // authApi.logoutがトークンを削除
    authApi.logout();

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
      const token = tokenManager.getToken();
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
        const user = await authApi.me();
        if (isMounted) {
          setState({
            user,
            isLoading: false,
            isAuthenticated: true,
          });
        }
      } catch {
        // トークンが無効な場合は削除
        tokenManager.removeToken();
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
