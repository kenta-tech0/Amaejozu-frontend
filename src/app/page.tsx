"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from 'next/navigation';
import { TabBar } from "@/components/TabBar";
import type { Product } from "@/types/product";
import type { ExternalSearchProduct } from "@/types/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

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

  const handleRemoveFromWatchlist = (productId: string) => {
    setWatchlist(watchlist.filter((p) => p.id !== productId));
  };

  const handleViewProduct = (product: Product) => {
    setPreviousScreen(currentScreen);
    setSelectedProduct(product);
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
          watchlist={watchlist}
          interestedCategories={interestedCategories}
        />
      )}
      {currentScreen === "search" && (
        <SearchScreen
          onViewProduct={handleViewProduct}
          onAddToWatchlist={handleAddToWatchlist}
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
          onAddToWatchlist={handleAddToWatchlist}
          isInWatchlist={!!watchlist.find((p) => p.id === selectedProduct.id)}
        />
      )}
      <TabBar currentScreen={currentScreen} onNavigate={setCurrentScreen} />
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

