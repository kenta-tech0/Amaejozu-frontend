// 既存のProduct型
export interface Product {
  id: string;
  name: string;
  image: string;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  shop: string;
  shopUrl?: string;
  category: string;
  brand?: string;
  skinType?: string[];
  aiReason?: string;
  priceHistory: {
    date: string;
    price: number;
  }[];
}

import type { ExternalSearchProduct } from './api';

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
    shopUrl: apiProduct.affiliate_url || apiProduct.shop_url,
    category: apiProduct.category || '未分類',
    brand: apiProduct.brand || undefined,
    skinType: [],
    aiReason: undefined,
    priceHistory: [],
  };
}