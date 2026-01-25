// カテゴリ
export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface CategoriesResponse {
  status: "ok";
  categories: Category[];
  count: number;
}

// ブランド
export interface Brand {
  id: string;
  name: string;
  shop_code: string;
}

export interface BrandsResponse {
  status: "ok";
  brands: Brand[];
  count: number;
}

// 商品（API レスポンス用）
export interface ApiProduct {
  id: string;
  name: string;
  brand_id?: string;
  brand_name?: string;
  category_id?: string;
  category_name?: string;
  current_price: number;
  original_price?: number;
  discount_rate?: number;
  is_on_sale?: boolean;
  image_url?: string;
  product_url?: string;
  review_score?: number;
  review_count?: number;
  ai_reason?: string;
  price_history?: {
    date: string;
    price: number;
  }[];
}

export interface ProductSearchResponse {
  status: "ok";
  products: ApiProduct[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ProductDetailResponse {
  status: "ok";
  product: ApiProduct;
}

// 検索パラメータ
export interface ProductSearchParams {
  keyword?: string;
  category_id?: string;
  brand_id?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: "price_asc" | "price_desc" | "discount" | "review" | "newest";
  page?: number;
  limit?: number;
}

// ウォッチリスト
export interface WatchlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    current_price: number;
    original_price?: number;
    discount_rate?: number;
    image_url?: string;
    brand_name?: string;
    category_name?: string;
  };
  target_price?: number;
  added_at: string; // ISO8601
}

export interface WatchlistResponse {
  watchlist: WatchlistItem[];
}

export interface AddWatchlistRequest {
  product_id: string;
  target_price?: number;
}

// 汎用メッセージ
export interface MessageResponse {
  message: string;
}

// 外部検索商品（楽天API経由）
export interface ExternalSearchProduct {
  rakuten_product_id: string;
  name: string;
  price: number;
  shop_name: string;
  image_url: string;
  product_url: string;
  affiliate_url: string;
  review_average: number;
  review_count: number;
}

export interface ExternalSearchResponse {
  status: "ok";
  products: ExternalSearchProduct[];
  total: number;
  page: number;
  limit: number;
  cached: boolean;
}

export interface ExternalSearchParams {
  keyword: string;
  page?: number;
  limit?: number;
}

// ウォッチリスト追加（商品データ付き）
export interface AddWatchlistWithProductRequest {
  product: ExternalSearchProduct;
  target_price?: number;
}

export interface AddWatchlistWithProductResponse {
  id: string;
  product: {
    id: string;
    name: string;
    current_price: number;
    image_url: string;
  };
  target_price?: number;
  added_at: string;
}

// 価格履歴
export interface PriceHistoryItem {
  price: number;
  recorded_at: string;
}

export interface PriceHistoryResponse {
  price_history: PriceHistoryItem[];
}

// 通知設定
export interface NotificationSettings {
  email_notifications: boolean;
  notification_frequency: string; // "daily" | "weekly" | "never" など
}

export interface NotificationSettingsResponse {
  email_notifications: boolean;
  notification_frequency: string;
}

export interface NotificationSettingsUpdateRequest {
  email_notifications?: boolean | null;
  notification_frequency?: string | null;
}