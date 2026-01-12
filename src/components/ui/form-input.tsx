import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from './utils';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
}

/**
 * フォーム入力コンポーネント
 * ラベル、アイコン、エラーメッセージをサポート
 * @param label - 入力フィールドのラベル
 * @param icon - 左側に表示するアイコン（Lucide Icon）
 * @param error - エラーメッセージ
 */
export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, icon: Icon, error, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm text-slate-600 dark:text-slate-400">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          )}
          <input
            ref={ref}
            className={cn(
              'w-full py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent',
              Icon ? 'pl-12 pr-4' : 'px-4',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
