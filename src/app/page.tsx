'use client';

import { useState } from 'react';
import { LoginScreen } from '@/components/Auth/LoginScreen';
import { OnboardingScreen } from '@/components/Onboarding/OnboardingScreen';
import { HomeScreen } from '@/components/Home/HomeScreen';
import { SearchScreen } from '@/components/Search/SearchScreen';
import { WatchlistScreen } from '@/components/Watchlist/WatchlistScreen';
import { SettingsScreen } from '@/components/Settings/SettingsScreen';
import { ProductDetailScreen } from '@/components/ProductDetail/ProductDetailScreen';
import { TabBar } from '@/components/TabBar';

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

type Screen = 'home' | 'search' | 'watchlist' | 'settings' | 'detail';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [watchlist, setWatchlist] = useState<Product[]>([]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleCompleteOnboarding = () => {
    setHasCompletedOnboarding(true);
  };

  const handleAddToWatchlist = (product: Product) => {
    if (watchlist.length < 50 && !watchlist.find(p => p.id === product.id)) {
      setWatchlist([...watchlist, product]);
    }
  };

  const handleRemoveFromWatchlist = (productId: string) => {
    setWatchlist(watchlist.filter(p => p.id !== productId));
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentScreen('detail');
  };

  const handleBack = () => {
    setSelectedProduct(null);
    setCurrentScreen('home');
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (!hasCompletedOnboarding) {
    return <OnboardingScreen onComplete={handleCompleteOnboarding} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 max-w-md mx-auto relative pb-20">
      {currentScreen === 'home' && (
        <HomeScreen
          onViewProduct={handleViewProduct}
          onAddToWatchlist={handleAddToWatchlist}
          watchlist={watchlist}
        />
      )}
      {currentScreen === 'search' && (
        <SearchScreen
          onViewProduct={handleViewProduct}
          onAddToWatchlist={handleAddToWatchlist}
          watchlist={watchlist}
        />
      )}
      {currentScreen === 'watchlist' && (
        <WatchlistScreen
          watchlist={watchlist}
          onViewProduct={handleViewProduct}
          onRemoveFromWatchlist={handleRemoveFromWatchlist}
          onNavigateToSearch={() => setCurrentScreen('search')}
        />
      )}
      {currentScreen === 'settings' && <SettingsScreen />}
      {currentScreen === 'detail' && selectedProduct && (
        <ProductDetailScreen
          product={selectedProduct}
          onBack={handleBack}
          onAddToWatchlist={handleAddToWatchlist}
          isInWatchlist={!!watchlist.find(p => p.id === selectedProduct.id)}
        />
      )}
      <TabBar currentScreen={currentScreen} onNavigate={setCurrentScreen} />
    </div>
  );
}