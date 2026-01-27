import type {
  Category,
  CategoriesResponse,
  Brand,
  BrandsResponse,
  ApiProduct,
  ProductSearchResponse,
  ProductDetailResponse,
  ProductSearchParams,
  WatchlistItem,
  WatchlistResponse,
  AddWatchlistRequest,
  MessageResponse,
  ExternalSearchProduct,
  ExternalSearchResponse,
  ExternalSearchParams,
  AddWatchlistWithProductRequest,
  AddWatchlistWithProductResponse,
  PriceHistoryResponse,
  NotificationSettingsResponse,
  NotificationSettingsUpdateRequest,
  WeeklyRankingResponse,
} from "@/types/api";

import type {
  AuthResponse,
  User,
} from "@/types/auth";

// APIベースURL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// トークン管理（認証チームが実装予定）
const TOKEN_KEY = "auth_token";

export const tokenManager = {
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
  },
};

// API エラー
export class ApiClientError extends Error {
  constructor(
    public status: number,
    public detail: string,
  ) {
    super(detail);
    this.name = "ApiClientError";
  }
}

// 共通fetch関数
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = tokenManager.getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // 204 No Content の場合
  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json();

  if (!response.ok) {
    let errorMessage = "エラーが発生しました";
    if (data.detail) {
      if (typeof data.detail === "string") {
        errorMessage = data.detail;
      } else {
        // FastAPIのバリデーションエラーなどオブジェクトの場合
        errorMessage = JSON.stringify(data.detail);
      }
    }
    throw new ApiClientError(response.status, errorMessage);
  }

  return data as T;
}

// 商品API
export const productsApi = {
  search: async (
    params: ProductSearchParams = {},
  ): Promise<ProductSearchResponse> => {
    const searchParams = new URLSearchParams();

    if (params.keyword) searchParams.set("keyword", params.keyword);
    if (params.category_id) searchParams.set("category_id", params.category_id);
    if (params.brand_id) searchParams.set("brand_id", params.brand_id);
    if (params.min_price !== undefined)
      searchParams.set("min_price", String(params.min_price));
    if (params.max_price !== undefined)
      searchParams.set("max_price", String(params.max_price));
    if (params.sort_by) searchParams.set("sort_by", params.sort_by);
    if (params.page !== undefined)
      searchParams.set("page", String(params.page));
    if (params.limit !== undefined)
      searchParams.set("limit", String(params.limit));

    const queryString = searchParams.toString();
    const url = `/api/products/search${queryString ? `?${queryString}` : ""}`;

    return apiFetch<ProductSearchResponse>(url);
  },

  getById: async (id: string): Promise<ApiProduct> => {
    const response = await apiFetch<ProductDetailResponse>(
      `/api/products/${id}`,
    );
    return response.product;
  },

  // TOP10取得（検索APIを利用、割引率順でソート）
  getTop10: async (): Promise<ApiProduct[]> => {
    const response = await productsApi.search({
      sort_by: "discount",
      limit: 10,
    });
    return response.products;
  },

  // 外部検索（楽天API経由、キャッシュ対応）
  externalSearch: async (
    params: ExternalSearchParams,
  ): Promise<ExternalSearchResponse> => {
    const searchParams = new URLSearchParams();
    searchParams.set("keyword", params.keyword);
    if (params.page !== undefined)
      searchParams.set("page", String(params.page));
    if (params.limit !== undefined)
      searchParams.set("limit", String(params.limit));

    const url = `/api/products/external-search?${searchParams.toString()}`;
    return apiFetch<ExternalSearchResponse>(url);
  },
};

// ウォッチリストAPI
export const watchlistApi = {
  getAll: async (): Promise<WatchlistItem[]> => {
    const response = await apiFetch<WatchlistResponse>("/api/watchlist");
    return response.watchlist;
  },

  add: async (
    productId: string,
    targetPrice?: number,
  ): Promise<MessageResponse> => {
    const body: AddWatchlistRequest = {
      product_id: productId,
    };
    if (targetPrice !== undefined) {
      body.target_price = targetPrice;
    }
    return apiFetch<MessageResponse>("/api/watchlist", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  remove: async (watchlistItemId: string): Promise<void> => {
    await apiFetch<void>(`/api/watchlist/${watchlistItemId}`, {
      method: "DELETE",
    });
  },

  // 商品データ付きでウォッチリストに追加
  addWithProduct: async (
    product: ExternalSearchProduct,
    targetPrice?: number,
  ): Promise<AddWatchlistWithProductResponse> => {
    // バックエンドのProductDataスキーマに合わせてフィールド名を変換
    const productForBackend = {
      rakuten_product_id: product.rakuten_product_id,
      name: product.name,
      price: product.current_price, // current_price -> price
      shop_name: product.shop_name,
      shop_code: product.shop_code,
      image_url: product.image_url,
      product_url: product.shop_url, // shop_url -> product_url
      affiliate_url: product.affiliate_url,
      review_average: product.review_score, // review_score -> review_average
      review_count: product.review_count,
    };
    const body: { product: typeof productForBackend; target_price?: number } = {
      product: productForBackend,
    };
    if (targetPrice !== undefined) {
      body.target_price = targetPrice;
    }
    return apiFetch<AddWatchlistWithProductResponse>(
      "/api/watchlist/with-product",
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );
  },

  // 価格履歴取得
  getPriceHistory: async (
    watchlistItemId: string,
  ): Promise<PriceHistoryResponse> => {
    return apiFetch<PriceHistoryResponse>(
      `/api/watchlist/${watchlistItemId}/price-history`,
    );
  },
};

// マスターデータAPI
export const masterApi = {
  getCategories: async (): Promise<Category[]> => {
    const response = await apiFetch<CategoriesResponse>("/api/categories");
    return response.categories;
  },

  getBrands: async (): Promise<Brand[]> => {
    const response = await apiFetch<BrandsResponse>("/api/brands");
    return response.brands;
  },
};

// 通知設定API
export const notificationApi = {
  getSettings: async (): Promise<NotificationSettingsResponse> => {
    return apiFetch<NotificationSettingsResponse>(
      "/api/user/notification-settings",
    );
  },

  updateSettings: async (
    settings: NotificationSettingsUpdateRequest,
  ): Promise<NotificationSettingsResponse> => {
    return apiFetch<NotificationSettingsResponse>(
      "/api/user/notification-settings",
      {
        method: "PUT",
        body: JSON.stringify(settings),
      },
    );
  },
};

// ランキングAPI
export const rankingApi = {
  // 週間TOP10ランキング取得
  getWeeklyRanking: async (
    year?: number,
    week?: number,
  ): Promise<WeeklyRankingResponse> => {
    const searchParams = new URLSearchParams();
    if (year !== undefined) searchParams.set("year", String(year));
    if (week !== undefined) searchParams.set("week", String(week));

    const queryString = searchParams.toString();
    const url = `/api/rankings/weekly${queryString ? `?${queryString}` : ""}`;

    return apiFetch<WeeklyRankingResponse>(url);
  },
};

// 認証API
export const authApi = {
  // ログイン
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const url = `${API_BASE_URL}/auth/login`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiClientError(response.status, data.detail || "ログインに失敗しました");
    }

    // トークンを保存
    if (data.token) {
      tokenManager.setToken(data.token);
    }

    return data;
  },

  // サインアップ
  signup: async (email: string, password: string, nickname: string): Promise<AuthResponse> => {
    const url = `${API_BASE_URL}/auth/signup`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, nickname }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiClientError(response.status, data.detail || "サインアップに失敗しました");
    }

    // トークンを保存
    if (data.token) {
      tokenManager.setToken(data.token);
    }

    return data;
  },

  // ユーザー情報取得
  me: async (): Promise<User> => {
    return apiFetch<User>("/auth/me");
  },

  // ログアウト
  logout: (): void => {
    tokenManager.removeToken();
  },
};
