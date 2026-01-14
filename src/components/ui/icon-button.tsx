'use client';
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from './utils';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

const iconSizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

/**
 * アイコンボタンコンポーネント
 * @param icon - 表示するLucideアイコン
 * @param variant - ボタンのスタイルバリエーション
 * @param size - ボタンのサイズ
 */
export function IconButton({
  icon: Icon,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: IconButtonProps) {
  const variantClasses = {
    primary: 'bg-orange-50 dark:bg-orange-900/20 text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900/30',
    secondary: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700',
    ghost: 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
  };

  return (
    <button
      className={cn(
        'rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      <Icon className={iconSizeClasses[size]} />
    </button>
  );
}
