// 既存のProduct型
export interface Product {
  id: string;
  name: string;
  image: string;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  shop: string;
  category: string;
  brand?: string;
  skinType?: string[];
  aiReason?: string;
  priceHistory: {
    date: string;
    price: number;
  }[];
}

import type { ExternalSearchProduct, ApiProduct, WeeklyRankingItem } from './api';

// 変換関数
export function convertExternalProductToProduct(
  apiProduct: ExternalSearchProduct
): Product {
  const originalPrice = apiProduct.original_price || apiProduct.current_price;
  const discount = apiProduct.original_price
    ? Math.round(
        ((apiProduct.original_price - apiProduct.current_price) /
          apiProduct.original_price) *
          100
      )
    : 0;

  return {
    id: apiProduct.rakuten_product_id,
    name: apiProduct.name,
    image: apiProduct.image_url,
    currentPrice: apiProduct.current_price,
    originalPrice: originalPrice,
    discount: discount,
    shop: apiProduct.shop_name,
    category: apiProduct.category || '未分類',
    brand: apiProduct.brand || undefined,
    skinType: [],
    aiReason: undefined,
    priceHistory: [],
  };
}

// ApiProduct → Product 変換関数（DB検索結果用）
export function convertApiProductToProduct(apiProduct: ApiProduct): Product {
  const originalPrice = apiProduct.original_price || apiProduct.current_price;
  const discount = apiProduct.discount_rate || 0;

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    image: apiProduct.image_url || apiProduct.image || '',
    currentPrice: apiProduct.current_price,
    originalPrice: originalPrice,
    discount: discount,
    shop: '楽天市場',
    category: apiProduct.category_name || '未分類',
    brand: apiProduct.brand_name || undefined,
    skinType: [],
    aiReason: apiProduct.ai_reason || undefined,
    priceHistory: apiProduct.price_history || [],
  };
}

// WeeklyRankingItem → Product 変換関数（週間ランキング用）
export function convertRankingItemToProduct(item: WeeklyRankingItem): Product {
  const product = item.product;
  const originalPrice = product.original_price || product.current_price;
  const discount = product.discount_rate || 0;

  return {
    id: product.id,
    name: product.name,
    image: product.image_url || '',
    currentPrice: product.current_price,
    originalPrice: originalPrice,
    discount: discount,
    shop: '楽天市場',
    category: product.category_name || '未分類',
    brand: product.brand_name || undefined,
    skinType: [],
    aiReason: item.ai_recommendation || undefined,
    priceHistory: [],
  };
}