import { useState } from 'react';
import { TrendingDown, Lock, CheckCircle, XCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ResetPasswordScreenProps {
  token: string;
  onSuccess: () => void;
  onBack: () => void;
}

export function ResetPasswordScreen({ token, onSuccess, onBack }: ResetPasswordScreenProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // バリデーション
    if (password.length < 8) {
      setError('パスワードは8文字以上で入力してください');
      return;
    }

    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          new_password: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSuccess(true);
      } else {
        setIsError(true);
        setError(data.detail || 'パスワードのリセットに失敗しました');
      }
    } catch {
      setIsError(true);
      setError('通信エラーが発生しました。再度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  // 成功画面
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col max-w-md mx-auto">
        <div className="flex-1 flex flex-col justify-center px-6 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              パスワードを変更しました
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              新しいパスワードでログインしてください。
            </p>
            <button
              onClick={onSuccess}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors"
            >
              ログイン画面へ
            </button>
          </div>
        </div>
      </div>
    );
  }

  // エラー画面（トークン無効など）
  if (isError && !error.includes('パスワード')) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col max-w-md mx-auto">
        <div className="flex-1 flex flex-col justify-center px-6 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500 rounded-full mb-6">
              <XCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              リンクが無効です
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              このパスワードリセットリンクは無効または期限切れです。
              もう一度リセットをリクエストしてください。
            </p>
            <button
              onClick={onBack}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors"
            >
              ログイン画面に戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 入力フォーム
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col max-w-md mx-auto">
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-500 rounded-3xl mb-6">
            <TrendingDown className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            新しいパスワードを設定
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            8文字以上の新しいパスワードを入力してください
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">
              新しいパスワード
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8文字以上"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
                minLength={8}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">
              パスワード（確認）
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="もう一度入力"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
                minLength={8}
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-xl transition-colors"
          >
            {isLoading ? '変更中...' : 'パスワードを変更'}
          </button>
        </form>
      </div>
    </div>
  );
}
