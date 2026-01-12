'use client';

import React, { useState } from 'react';
import { Package } from 'lucide-react';
import { cn } from './utils';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-20 h-20',
  lg: 'w-24 h-24',
  xl: 'w-32 h-32',
};

/**
 * 商品画像を表示するコンポーネント
 * 画像の読み込みに失敗した場合はプレースホルダーを表示
 * @param src - 画像URL
 * @param alt - 代替テキスト
 * @param className - 追加のCSSクラス
 * @param size - 画像サイズ
 */
export function ProductImage({ src, alt, className, size = 'md' }: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={cn(
          sizeClasses[size],
          'bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center',
          className
        )}
      >
        <Package className="w-6 h-6 text-slate-400" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn(sizeClasses[size], 'object-cover rounded-xl', className)}
      onError={() => setHasError(true)}
    />
  );
}
