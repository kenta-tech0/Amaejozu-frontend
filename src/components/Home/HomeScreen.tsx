import { Product } from '@/types/product';
import { mockProducts } from '@/lib/mock-data';
import { Plus, TrendingDown } from 'lucide-react';
import Image from 'next/image';

interface HomeScreenProps {
  onViewProduct: (product: Product) => void;
  onAddToWatchlist: (product: Product) => void;
  watchlist: Product[];
}

export function HomeScreen({ onViewProduct, onAddToWatchlist, watchlist }: HomeScreenProps) {
  const currentTime = new Date();
  const updateTime = '今日 6:00';

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-orange-500 p-2 rounded-2xl">
            <TrendingDown className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl text-slate-900 dark:text-white">価格比較</h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          最終更新: {updateTime}
        </p>
      </div>

      {/* TOP10 Section */}
      <div className="px-6 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-slate-900 dark:text-white">今日のTOP10</h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">AIが選定</span>
        </div>

        <div className="space-y-4">
          {mockProducts.map((product, index) => {
            const isInWatchlist = watchlist.some(p => p.id === product.id);

            return (
              <div
                key={product.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 hover:border-orange-500 dark:hover:border-orange-500 transition-colors cursor-pointer"
                onClick={() => onViewProduct(product)}
              >
                <div className="flex gap-4 items-start">
                  {/* Rank */}
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      index < 3
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {index + 1}
                    </div>
                  </div>

                  {/* Image */}
                  <div className="flex-shrink-0">
                    <Image
                      src={product.image || 'https://placehold.co/400x400?text=No+Image'}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {product.brand}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {product.category}
                      </span>
                    </div>
                    <h3 className="text-slate-900 dark:text-white text-sm line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {product.shop}
                      </span>
                      <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded">
                        {product.discount}%OFF
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-slate-900 dark:text-white">
                        ¥{product.currentPrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        ¥{product.originalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Add Button */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isInWatchlist) {
                          onAddToWatchlist(product);
                        }
                      }}
                      disabled={isInWatchlist}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        isInWatchlist
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                          : 'bg-orange-50 dark:bg-orange-900/20 text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900/30'
                      }`}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
