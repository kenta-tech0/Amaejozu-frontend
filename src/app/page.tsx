"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from 'next/navigation';
import { TabBar } from "@/components/TabBar";
import type { Product } from "@/types/product";
import { convertExternalProductToProduct } from "@/types/product";
import type { ExternalSearchProduct } from "@/types/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { watchlistApi } from '@/lib/api-client';
import { TargetPriceDialog } from "@/components/common/TargetPriceDialog";

// 常に必要
import { HomeScreen } from "@/components/Home/HomeScreen";
import { LoginScreen } from "@/components/Auth/LoginScreen";
import { OnboardingScreen } from "@/components/Onboarding/OnboardingScreen";
import { ForgotPasswordScreen } from '@/components/Auth/ForgotPasswordScreen';
import { ResetPasswordScreen } from '@/components/Auth/ResetPasswordScreen';

// 使う時だけ
const SearchScreen = dynamic(
  () =>
    import("@/components/Search/SearchScreen").then((m) => ({
      default: m.SearchScreen,
    })),
  {
    loading: () => <LoadingSpinner />,
  },
);

const WatchlistScreen = dynamic(
  () =>
    import("@/components/Watchlist/WatchlistScreen").then((m) => ({
      default: m.WatchlistScreen,
    })),
  {
    loading: () => <LoadingSpinner />,
  },
);

const SettingsScreen = dynamic(
  () =>
    import("@/components/Settings/SettingsScreen").then((m) => ({
      default: m.SettingsScreen,
    })),
  {
    loading: () => <LoadingSpinner />,
  },
);

const NotificationsScreen = dynamic(
  () =>
    import("@/components/Notifications/NotificationsScreen").then((m) => ({
      default: m.NotificationsScreen,
    })),
  {
    loading: () => <LoadingSpinner />,
  },
);

const ProductDetailScreen = dynamic(
  () =>
    import("@/components/ProductDetail/ProductDetailScreen").then((m) => ({
      default: m.ProductDetailScreen,
    })),
  {
    loading: () => <LoadingSpinner />,
  },
);

const Top10Screen = dynamic(
  () =>
    import("@/components/Top10/Top10Screen").then((m) => ({
      default: m.Top10Screen,
    })),
  {
    loading: () => <LoadingSpinner />,
  },
);

type Screen =
  | "home"
  | "search"
  | "watchlist"
  | "settings"
  | "detail"
  | "top10"
  | "notifications";
type AuthScreen = 'login' | 'forgot-password' | 'reset-password';

// LocalStorage keys
const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: 'amaejozu_onboarding_completed',
  INTERESTED_CATEGORIES: 'amaejozu_interested_categories',
} as const;

function AppContent() {
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [previousScreen, setPreviousScreen] = useState<Screen>("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [watchlist, setWatchlist] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchProducts, setSearchProducts] = useState<ExternalSearchProduct[]>([]);
  const [interestedCategories, setInterestedCategories] = useState<string[]>([]);
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // 目標価格ダイアログ用のstate
  const [pendingProduct, setPendingProduct] = useState<ExternalSearchProduct | null>(null);
  const [showTargetPriceDialog, setShowTargetPriceDialog] = useState(false);
  
  // 詳細画面表示中の外部商品（APIに送信するため）
  const [selectedExternalProduct, setSelectedExternalProduct] = useState<ExternalSearchProduct | null>(null);

  // LocalStorageから状態を復元
  useEffect(() => {
    const savedOnboarding = localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    const savedCategories = localStorage.getItem(STORAGE_KEYS.INTERESTED_CATEGORIES);

    if (savedOnboarding === 'true') {
      setHasCompletedOnboarding(true);
    }
    if (savedCategories) {
      try {
        setInterestedCategories(JSON.parse(savedCategories));
      } catch {
        // Invalid JSON, ignore
      }
    }
    setIsHydrated(true);
  }, []);

  // URLパラメータからreset-passwordのトークンを取得
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setAuthScreen('reset-password');
      setResetToken(token);
    }
  }, [searchParams]);

  // ホーム画面表示時に他の画面を先読み
  useEffect(() => {
    if (hasCompletedOnboarding && isAuthenticated) {
      import("@/components/Search/SearchScreen");
      import("@/components/Watchlist/WatchlistScreen");
      import("@/components/Settings/SettingsScreen");
      import("@/components/Top10/Top10Screen");
    }
  }, [hasCompletedOnboarding, isAuthenticated]);

  const handleForgotPassword = () => {
    setAuthScreen('forgot-password');
  };


  const handleBackToLogin = () => {
    setAuthScreen('login');
    setResetToken(null);
    window.history.replaceState({}, '', '/');
  };

  const handleResetPasswordSuccess = () => {
    setAuthScreen('login');
    setResetToken(null);
    window.history.replaceState({}, '', '/');
  };

  const handleCompleteOnboarding = (categories: string[]) => {
    setInterestedCategories(categories);
    setHasCompletedOnboarding(true);
    // LocalStorageに保存
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    localStorage.setItem(STORAGE_KEYS.INTERESTED_CATEGORIES, JSON.stringify(categories));
  };

  const handleAddToWatchlist = (product: Product) => {
    if (watchlist.length < 50 && !watchlist.find((p) => p.id === product.id)) {
      setWatchlist([...watchlist, product]);
    }
  };

  // 外部検索商品をウォッチリストに追加（ダイアログを表示）
  const handleAddExternalToWatchlist = async (externalProduct: ExternalSearchProduct) => {
    if (watchlist.length >= 50 || watchlist.find((p) => p.id === externalProduct.rakuten_product_id)) {
      return;
    }
    // ダイアログを表示するために商品を保存
    setPendingProduct(externalProduct);
    setShowTargetPriceDialog(true);
  };

  // ダイアログで確定した後の実際の追加処理
  const handleConfirmAddToWatchlist = async (targetPrice: number | null) => {
    if (!pendingProduct) return;

    try {
      await watchlistApi.addWithProduct(pendingProduct, targetPrice ?? undefined);
    } catch (error) {
      console.error("ウォッチリスト追加エラー:", error);
      // 重複エラーの場合は警告だけ出してダイアログは閉じる
      if (error instanceof Error && error.message.includes("既に")) {
        console.warn("商品は既にウォッチリストに存在します");
      } else {
        alert(`ウォッチリストへの追加に失敗しました: ${error instanceof Error ? error.message : "不明なエラー"}`);
      }
    }

    // 成功・失敗に関わらずDBから最新のウォッチリストを再取得
    try {
      const items = await watchlistApi.getAll();
      const products: Product[] = items.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        image: item.product.image_url || "",
        currentPrice: item.product.current_price,
        originalPrice: item.product.original_price || item.product.current_price,
        discount: item.product.discount_rate || 0,
        shop: "",
        category: item.product.category_name || "未分類",
        brand: item.product.brand_name || undefined,
        priceHistory: [],
      }));
      setWatchlist(products);
    } catch (fetchError) {
      console.error("ウォッチリスト取得エラー:", fetchError);
    }

    // ダイアログを閉じてpendingをクリア
    setShowTargetPriceDialog(false);
    setPendingProduct(null);
  };

  // ダイアログキャンセル
  const handleCancelTargetPriceDialog = () => {
    setShowTargetPriceDialog(false);
    setPendingProduct(null);
  };

  // ProductDetailScreenからのウォッチリスト追加（ダイアログを表示）
  const handleAddToWatchlistFromDetail = (product: Product) => {
    // 既にウォッチリストに存在する場合は何もしない
    if (watchlist.find((p) => p.id === product.id)) {
      return;
    }
    
    if (selectedExternalProduct) {
      // 外部検索商品の場合はダイアログを表示
      setPendingProduct(selectedExternalProduct);
      setShowTargetPriceDialog(true);
    } else {
      // 内部商品の場合は従来の処理（ローカルstateのみ）
      handleAddToWatchlist(product);
    }
  };

  const handleRemoveFromWatchlist = (productId: string) => {
    setWatchlist(watchlist.filter((p) => p.id !== productId));
  };

  const handleViewProduct = (product: Product, externalProduct?: ExternalSearchProduct) => {
    setPreviousScreen(currentScreen);
    setSelectedProduct(product);
    
    // 外部商品が直接渡された場合はそれを使用、なければsearchProductsから探す
    if (externalProduct) {
      setSelectedExternalProduct(externalProduct);
    } else {
      const foundExternalProduct = searchProducts.find(p => p.rakuten_product_id === product.id);
      setSelectedExternalProduct(foundExternalProduct || null);
    }
    
    setCurrentScreen("detail");
  };

  const handleViewProductById = (productId: string) => {
    // WatchlistScreenから呼ばれる場合、productIdからProductを取得する必要がある
    // 現時点ではwatchlistから該当商品を探す
    const product = watchlist.find((p) => p.id === productId);
    if (product) {
      handleViewProduct(product);
    }
  };

  const handleBack = () => {
    setSelectedProduct(null);
    setSelectedExternalProduct(null);
    setCurrentScreen(previousScreen);
  };

  // 初回ロード時（トークンがあり認証チェック中、またはハイドレーション中）はローディング表示
  // ログイン/サインアップ処理中はLoginScreen内でローディングを表示
  if ((isLoading && isAuthenticated) || !isHydrated) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // 未認証の場合は認証画面を表示（LoginScreen内でローディング状態を処理）
  if (!isAuthenticated) {
    // 認証画面のルーティング
    if (authScreen === 'login') {
      return <LoginScreen onForgotPassword={handleForgotPassword} />;
    }

    if (authScreen === 'forgot-password') {
      return <ForgotPasswordScreen onBack={handleBackToLogin} />;
    }

    if (authScreen === 'reset-password' && resetToken) {
      return (
        <ResetPasswordScreen
          token={resetToken}
          onSuccess={handleResetPasswordSuccess}
          onBack={handleBackToLogin}
        />
      );
    }

    // Default to login
    return <LoginScreen onForgotPassword={handleForgotPassword} />;
  }

  if (!hasCompletedOnboarding) {
    return <OnboardingScreen onComplete={handleCompleteOnboarding} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 max-w-md mx-auto relative pb-20">
      {currentScreen === "home" && (
        <HomeScreen
          onViewProduct={handleViewProduct}
          onAddToWatchlist={handleAddToWatchlist}
          onAddExternalToWatchlist={handleAddExternalToWatchlist}
          watchlist={watchlist}
          interestedCategories={interestedCategories}
        />
      )}
      {currentScreen === "search" && (
        <SearchScreen
          onViewProduct={handleViewProduct}
          onAddToWatchlist={handleAddToWatchlist}
          onAddExternalToWatchlist={handleAddExternalToWatchlist}
          watchlist={watchlist}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          searchProducts={searchProducts}
          onSearchProductsChange={setSearchProducts}
        />
      )}
      {currentScreen === "watchlist" && (
        <WatchlistScreen
          onViewProduct={handleViewProductById}
          onNavigateToSearch={() => setCurrentScreen("search")}
        />
      )}
      {currentScreen === "settings" && (
        <SettingsScreen
          onLogout={logout}
          onNavigateToNotifications={() => setCurrentScreen("notifications")}
        />
      )}
      {currentScreen === "notifications" && (
        <NotificationsScreen onBack={() => setCurrentScreen("settings")} />
      )}
      {currentScreen === "top10" && (
        <Top10Screen onViewProduct={handleViewProduct} />
      )}
      {currentScreen === "detail" && selectedProduct && (
        <ProductDetailScreen
          product={selectedProduct}
          onBack={handleBack}
          onAddToWatchlist={handleAddToWatchlistFromDetail}
          isInWatchlist={!!watchlist.find((p) => p.id === selectedProduct.id)}
        />
      )}
      <TabBar currentScreen={currentScreen} onNavigate={setCurrentScreen} />

      {/* 目標価格ダイアログ */}
      {showTargetPriceDialog && pendingProduct && (
        <TargetPriceDialog
          productName={pendingProduct.name}
          currentPrice={pendingProduct.current_price}
          onConfirm={handleConfirmAddToWatchlist}
          onCancel={handleCancelTargetPriceDialog}
        />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <AppContent />
      </Suspense>
    </AuthProvider>
  );
}
