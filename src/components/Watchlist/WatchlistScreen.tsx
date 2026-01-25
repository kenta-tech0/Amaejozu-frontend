"use client";

import { useState, useEffect } from "react";
import { Heart, Search, Trash2, ExternalLink } from "lucide-react";
import Image from "next/image";
import { watchlistApi } from "@/lib/api-client";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import type { WatchlistItem } from "@/types/api";

interface WatchlistScreenProps {
  onViewProduct: (productId: string) => void;
  onNavigateToSearch: () => void;
}

export function WatchlistScreen({
  onViewProduct,
  onNavigateToSearch,
}: WatchlistScreenProps) {
  const maxItems = 50;
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentCount = watchlist.length;

  // 初期データ取得
  useEffect(() => {
    watchlistApi.getAll()
      .then((items) => {
        setWatchlist(items);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "取得に失敗しました");
      })
      .finally(() => setLoading(false));
  }, []);

  // 削除
  const handleRemove = async (id: string) => {
    try {
      await watchlistApi.remove(id);
      setWatchlist((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "削除に失敗しました");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl text-slate-900 dark:text-white">ウォッチリスト</h1>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {currentCount}/{maxItems}件
          </span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          お気に入り商品の価格変動をチェック
        </p>
      </div>

      {/* Content */}
      <div className="px-6 pt-6">
        {watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-slate-900 dark:text-white mb-2">ウォッチリストが空です</h3>
            <p className="text-slate-600 dark:text-slate-400 text-center mb-6">
              気になる商品を追加して<br />価格変動を追跡しましょう
            </p>
            <button
              onClick={onNavigateToSearch}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors"
            >
              <Search className="w-5 h-5" />
              <span>検索から商品を追加</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {watchlist.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 hover:border-orange-500 dark:hover:border-orange-500 transition-colors"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <div
                    className="flex-shrink-0 cursor-pointer"
                    onClick={() => onViewProduct(item.product.id)}
                  >
                    <Image
                      src={item.product.image_url || 'https://placehold.co/400x400?text=No+Image'}
                      alt={item.product.name}
                      width={400}
                      height={400}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                  </div>

                  {/* Info */}
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => onViewProduct(item.product.id)}
                  >
                    <h3 className="text-slate-900 dark:text-white text-sm line-clamp-2 mb-2">
                      {item.product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      {item.product.brand_name && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">{item.product.brand_name}</span>
                      )}
                      {item.product.discount_rate && item.product.discount_rate > 0 && (
                        <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded">
                          {item.product.discount_rate}%OFF
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-lg text-slate-900 dark:text-white">
                        ¥{item.product.current_price.toLocaleString()}
                      </span>
                      {item.product.original_price && (
                        <span className="text-xs text-slate-400 line-through">
                          ¥{item.product.original_price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex-shrink-0 flex flex-col gap-2">
                    {/* Shop Button */}
                    {item.product.shop_url && (
                      
                        href={item.product.shop_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 text-orange-500 transition-colors flex items-center justify-center"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}

                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(item.id);
                      }}
                      className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}