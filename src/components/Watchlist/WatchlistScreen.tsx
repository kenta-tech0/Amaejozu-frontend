"use client";

import { useState, useEffect } from "react";
import { Heart, Search, Trash2, Target, Trophy , ExternalLink } from "lucide-react";
import Image from "next/image";
import { watchlistApi } from "@/lib/api-client";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import type { WatchlistItem } from "@/types/api";
import type { Product } from "@/types/product";

interface WatchlistScreenProps {
  onViewProduct: (product: Product) => void;
  onNavigateToSearch: () => void;
}

// 到達率を計算する関数
function calculateProgress(
  currentPrice: number,
  originalPrice: number | undefined,
  targetPrice: number | undefined
): number | null {
  if (!targetPrice) return null;
  
  const basePrice = originalPrice || currentPrice;
  
  // 既に目標達成
  if (currentPrice <= targetPrice) return 100;
  
  // 目標価格が現在価格より高い場合（意味のない目標）
  if (targetPrice >= basePrice) return 0;
  
  // 到達率 = (元の価格 - 現在価格) / (元の価格 - 目標価格) * 100
  const totalDrop = basePrice - targetPrice;
  const actualDrop = basePrice - currentPrice;
  const progress = (actualDrop / totalDrop) * 100;
  
  return Math.max(0, Math.min(100, Math.round(progress)));
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
    watchlistApi
      .getAll()
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

  // WatchlistItem から Product に変換
  const convertToProduct = (item: WatchlistItem): Product => ({
    id: item.product.id,
    name: item.product.name,
    image: item.product.image_url || "",
    currentPrice: item.product.current_price,
    originalPrice: item.product.original_price || item.product.current_price,
    discount: item.product.discount_rate || 0,
    shop: "",
    shopUrl: item.product.product_url,
    category: item.product.category_name || "未分類",
    brand: item.product.brand_name,
    priceHistory: [],
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl text-slate-900 dark:text-white">
            ウォッチリスト
          </h1>
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
            <h3 className="text-slate-900 dark:text-white mb-2">
              ウォッチリストが空です
              </h3>
            <p className="text-slate-600 dark:text-slate-400 text-center mb-6">
              気になる商品を追加して
              <br />
              価格変動を追跡しましょう
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
            {watchlist.map((item) => {
              const progress = calculateProgress(
                item.product.current_price,
                item.product.original_price,
                item.target_price
              );
              const isGoalAchieved = progress === 100;

              return (
                <div
                  key={item.id}
                  className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 transition-colors ${
                    isGoalAchieved
                      ? "border-green-500 dark:border-green-500"
                      : "border-slate-200 dark:border-slate-800 hover:border-orange-500 dark:hover:border-orange-500"
                  }`}
                >
                  {/* 目標達成バッジ */}
                  {isGoalAchieved && (
                    <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-xl">
                      <Trophy className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-green-700 dark:text-green-400">
                        🎉 目標価格に到達しました！
                      </span>
                    </div>
                  )}

                  <div className="flex gap-4">
                    {/* Image */}
                    <div
                      className="flex-shrink-0 cursor-pointer"
                      onClick={() => onViewProduct(convertToProduct(item))}
                    >
                      <Image
                        src={
                          item.product.image_url ||
                        "https://placehold.co/400x400?text=No+Image"
                      }
                        alt={item.product.name}
                        width={400}
                        height={400}
                        className="w-24 h-24 object-cover rounded-xl"
                      />
                    </div>

                    {/* Info */}
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => onViewProduct(convertToProduct(item))}
                    >
                      <h3 className="text-slate-900 dark:text-white text-sm line-clamp-2 mb-2">
                        {item.product.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        {item.product.brand_name && (
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {item.product.brand_name}
                            </span>
                        )}
                        {item.product.discount_rate &&
                        item.product.discount_rate > 0 && (
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

                      {/* 目標価格と到達率 */}
                      {item.target_price && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                              <Target className="w-3 h-3" />
                              <span>目標: ¥{item.target_price.toLocaleString()}</span>
                            </div>
                            <span className={`font-medium ${
                              isGoalAchieved 
                                ? "text-green-600 dark:text-green-400" 
                                : "text-orange-600 dark:text-orange-400"
                            }`}>
                              {progress}%
                            </span>
                          </div>
                          {/* プログレスバー */}
                          <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isGoalAchieved 
                                  ? "bg-green-500" 
                                  : "bg-orange-500"
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                  {/* Action Buttons */}
                  <div className="flex-shrink-0 flex flex-col gap-2">
                    {/* Shop Button */}
                    {item.product.product_url && (
                      <a
                        href={item.product.product_url}
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
                      className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
