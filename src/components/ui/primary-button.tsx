'use client';
import React from 'react';
import { cn } from './utils';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  children: React.ReactNode;
}

/**
 * プライマリーボタンコンポーネント
 * アプリのメインカラー（オレンジ）を使用したボタン
 * @param variant - ボタンのスタイルバリエーション
 * @param fullWidth - 幅を100%にするかどうか
 * @param children - ボタンのコンテンツ
 */
export function PrimaryButton({
  variant = 'primary',
  fullWidth = false,
  className,
  children,
  ...props
}: PrimaryButtonProps) {
  const variantClasses = {
    primary: 'bg-orange-500 hover:bg-orange-600 text-white',
    secondary: 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white',
    outline: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white',
  };

  return (
    <button
      className={cn(
        'py-4 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
