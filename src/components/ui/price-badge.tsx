'use client';
import React from 'react';
import { cn } from './utils';

interface PriceBadgeProps {
  discount: number;
  className?: string;
}

/**
 * 割引率を表示するバッジコンポーネント
 * @param discount - 割引率（%）
 * @param className - 追加のCSSクラス
 */
export function PriceBadge({ discount, className }: PriceBadgeProps) {
  return (
    <span
      className={cn(
        'px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded',
        className
      )}
    >
      {discount}%OFF
    </span>
  );
}
