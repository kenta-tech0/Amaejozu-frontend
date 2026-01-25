import { useState, useEffect } from "react";
import { productsApi } from "@/lib/api-client";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import type { ExternalSearchProduct } from "@/types/api";
import type { Product } from "@/types/product";
import { Search, Plus } from "lucide-react";
import Image from "next/image";
import { convertExternalProductToProduct } from "@/types/product";

interface SearchScreenProps {
  onViewProduct: (product: Product) => void;
  onAddToWatchlist: (product: Product) => void;
  watchlist: Product[];
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  searchProducts: ExternalSearchProduct[];
  onSearchProductsChange: (products: ExternalSearchProduct[]) => void;
}

export function SearchScreen({
  onViewProduct,
  onAddToWatchlist,
  watchlist,
  searchQuery,
  onSearchQueryChange,
  searchProducts,
  onSearchProductsChange,
}: SearchScreenProps) {
  // API連携用のstate
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // キーワードが空の場合は検索しない
    if (!searchQuery.trim()) {
      return;
    }
    if (searchProducts.length > 0) {
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await productsApi.externalSearch({
          keyword: searchQuery,
          limit: 20,
        });
        onSearchProductsChange(response.products);
      } catch (err) {
        setError(err instanceof Error ? err.message : "検索に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    // デバウンス：入力後500ms待ってから検索
    const timer = setTimeout(fetchProducts, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, onSearchProductsChange]);

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 pt-6 pb-4">
        <h1 className="text-2xl text-slate-900 dark:text-white mb-4">
          商品検索
        </h1>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="商品名やブランドで検索..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Results */}
      <div className="px-6 pt-4">
        {/* Loading状態 */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        )}

        {/* Error状態 */}
        {!loading && error && (
          <div className="py-4">
            <ErrorMessage message={error} />
          </div>
        )}

        {/* 初期状態 */}
        {!loading &&
          !error &&
          searchQuery.trim() === "" &&
          searchProducts.length === 0 && (
            <p className="text-center py-20 text-sm text-slate-500 dark:text-slate-400">
              商品名を入力して検索してください
            </p>
          )}

        {/* 検索結果0件 */}
        {!loading &&
          !error &&
          searchQuery.trim() !== "" &&
          searchProducts.length === 0 && (
            <p className="text-center py-20 text-sm text-slate-500 dark:text-slate-400">
              検索結果がありません
            </p>
          )}

        {/* 商品一覧 */}
        {!loading && !error && searchProducts.length > 0 && (
          <>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              {searchProducts.length}件の商品
            </p>

            <div className="grid grid-cols-2 gap-4">
              {searchProducts.map((searchProducts) => {
                const isInWatchlist = watchlist.some(
                  (p) => p.id === searchProducts.rakuten_product_id,
                );

                return (
                  <div
                    key={searchProducts.rakuten_product_id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 hover:border-orange-500 dark:hover:border-orange-500 transition-colors cursor-pointer"
                    onClick={() =>
                      onViewProduct(
                        convertExternalProductToProduct(searchProducts),
                      )
                    }
                  >
                    {/* Image */}
                    <div className="relative mb-3">
                      {searchProducts.image_url ? (
                        <Image
                          src={searchProducts.image_url}
                          alt={searchProducts.name}
                          width={400}
                          height={400}
                          className="w-full aspect-square object-cover rounded-xl"
                        />
                      ) : (
                        <div className="w-full aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                          <span className="text-slate-400 dark:text-slate-500 text-xs">
                            No Photo
                          </span>
                        </div>
                      )}

                      {/* Watchlist Button */}
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isInWatchlist)
                              onAddToWatchlist(
                                convertExternalProductToProduct(searchProducts),
                              );
                          }}
                          disabled={isInWatchlist}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-sm transition-colors ${
                            isInWatchlist
                              ? "bg-slate-100/80 dark:bg-slate-800/80 text-slate-400 cursor-not-allowed"
                              : "bg-white/80 dark:bg-slate-900/80 text-orange-500 hover:bg-white dark:hover:bg-slate-900"
                          }`}
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    {searchProducts.shop_name && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        {searchProducts.shop_name}
                      </p>
                    )}

                    <h3 className="text-sm text-slate-900 dark:text-white line-clamp-2 mb-2 min-h-[2.5rem]">
                      {searchProducts.name}
                    </h3>

                    <div className="space-y-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg text-slate-900 dark:text-white font-medium">
                          {searchProducts.current_price
                            ? `¥${searchProducts.current_price.toLocaleString()}`
                            : "¥---"}
                        </span>
                      </div>

                      {/* レビュー情報 */}
                      {searchProducts.review_count > 0 && (
                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                          {searchProducts.review_score && (
                            <span>
                              ⭐ {searchProducts.review_score.toFixed(1)}
                            </span>
                          )}
                          <span>({searchProducts.review_count}件)</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
