'use client';

import { Product } from '@/types/product';
import { TrendingUp, Sparkles } from 'lucide-react';
import { mockProducts } from '@/lib/mock-data';
import Image from 'next/image';

interface Top10ScreenProps {
  onViewProduct: (product: Product) => void;
}

export function Top10Screen({ onViewProduct }: Top10ScreenProps) {
  // TODO: 後でバックエンドAPIから取得
  // const top10Products: Product[] = [];
  const top10Products: Product[] = mockProducts.slice(0, 10);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className=" bg-orange-500  text-white px-6 pt-8 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-6 h-6" />
          <h1 className="text-2xl font-bold">週間TOP10</h1>
        </div>
        <p className="text-white/90 text-sm">今週の人気商品</p>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-4">
        {top10Products.length === 0 ? (
          <div className="text-center py-16">
            <Sparkles className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">週間TOP10を準備中です</p>
          </div>
        ) : (
          top10Products.map((product, index) => (
            <div
              key={product.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 hover:border-orange-500 transition-colors cursor-pointer"
              onClick={() => onViewProduct(product)}
            >
              <div className="flex gap-4">
                {/* Rank Badge */}
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    index === 0 ? 'bg-yellow-400 text-yellow-900' :
                    index === 1 ? 'bg-slate-300 text-slate-700' :
                    index === 2 ? 'bg-orange-400 text-orange-900' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {index + 1}
                  </div>
                </div>

                {/* Product Image */}
                <div className="flex-shrink-0">
                  <Image
                    src={product.image || 'https://placehold.co/80x80?text=No+Image'}
                    alt={product.name}
                    width={80}
                    height={80}
                    className="rounded-xl object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-slate-900 dark:text-white line-clamp-2 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                    {product.brand}
                  </p>
                  
                  {/* AI Recommendation */}
                  {product.aiReason && (
                    <div className="flex items-start gap-1 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2 mb-2">
                      <Sparkles className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-purple-700 dark:text-purple-300 line-clamp-2">
                        {product.aiReason}
                      </p>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-orange-500">
                      ¥{product.currentPrice.toLocaleString()}
                    </span>
                    {product.discount && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                        {product.discount}%OFF
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}