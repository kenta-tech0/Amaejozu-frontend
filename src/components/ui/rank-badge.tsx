'use client';
import React from 'react';
import { cn } from './utils';

interface RankBadgeProps {
  rank: number;
  className?: string;
}

/**
 * ランキング順位を表示するバッジコンポーネント
 * 1-3位は特別なスタイルで表示
 * @param rank - 順位（1から始まる）
 * @param className - 追加のCSSクラス
 */
export function RankBadge({ rank, className }: RankBadgeProps) {
  const isTopThree = rank <= 3;

  return (
    <div
      className={cn(
        'w-8 h-8 rounded-lg flex items-center justify-center',
        isTopThree
          ? 'bg-orange-500 text-white'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
        className
      )}
    >
      {rank}
    </div>
  );
}
