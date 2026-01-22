"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { TabBar } from "@/components/TabBar";
import type { Product } from "@/types/product";

// 常に必要
import { HomeScreen } from "@/components/Home/HomeScreen";
import { LoginScreen } from "@/components/Auth/LoginScreen";
import { OnboardingScreen } from "@/components/Onboarding/OnboardingScreen";

// 使う時だけ
const SearchScreen = dynamic(
  () =>
    import("@/components/Search/SearchScreen").then((m) => ({
      default: m.SearchScreen,
    })),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        読み込み中...
      </div>
    ),
  },
);

const WatchlistScreen = dynamic(
  () =>
    import("@/components/Watchlist/WatchlistScreen").then((m) => ({
      default: m.WatchlistScreen,
    })),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        読み込み中...
      </div>
    ),
  },
);

const SettingsScreen = dynamic(
  () =>
    import("@/components/Settings/SettingsScreen").then((m) => ({
      default: m.SettingsScreen,
    })),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        読み込み中...
      </div>
    ),
  },
);

const NotificationsScreen = dynamic(
  () =>
    import("@/components/Notifications/NotificationsScreen").then((m) => ({
      default: m.NotificationsScreen,
    })),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        読み込み中...
      </div>
    ),
  },
);

const ProductDetailScreen = dynamic(
  () =>
    import("@/components/ProductDetail/ProductDetailScreen").then((m) => ({
      default: m.ProductDetailScreen,
    })),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        読み込み中...
      </div>
    ),
  },
);

const Top10Screen = dynamic(
  () =>
    import("@/components/Top10/Top10Screen").then((m) => ({
      default: m.Top10Screen,
    })),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        読み込み中...
      </div>
    ),
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

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [watchlist, setWatchlist] = useState<Product[]>([]);

  // ホーム画面表示時に他の画面を先読み
  useEffect(() => {
    if (hasCompletedOnboarding && isAuthenticated) {
      // よく使われる画面を先読み
      import("@/components/Search/SearchScreen");
      import("@/components/Watchlist/WatchlistScreen");
      import("@/components/Settings/SettingsScreen");
      import("@/components/Top10/Top10Screen");
    }
  }, [hasCompletedOnboarding, isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleCompleteOnboarding = () => {
    setHasCompletedOnboarding(true);
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
    setSelectedProduct(product);
    setCurrentScreen("detail");
  };

  const handleBack = () => {
    setSelectedProduct(null);
    setCurrentScreen("home");
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
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
        />
      )}
      {currentScreen === "search" && (
        <SearchScreen
          onViewProduct={handleViewProduct}
          onAddToWatchlist={handleAddToWatchlist}
          watchlist={watchlist}
        />
      )}
      {currentScreen === "watchlist" && (
        <WatchlistScreen
          watchlist={watchlist}
          onViewProduct={handleViewProduct}
          onRemoveFromWatchlist={handleRemoveFromWatchlist}
          onNavigateToSearch={() => setCurrentScreen("search")}
        />
      )}
      {currentScreen === "settings" && (
        <SettingsScreen
          onLogout={() => setIsAuthenticated(false)}
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
