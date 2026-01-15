'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { HomeScreen } from '@/components/Home/HomeScreen';
import { TabBar } from '@/components/navigation/TabBar';
import { Product } from '@/types/product';

export default function Home() {
  const router = useRouter();
  const [watchlist, setWatchlist] = useState<Product[]>([]);

  const handleViewProduct = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  const handleAddToWatchlist = (product: Product) => {
    if (watchlist.length < 50 && !watchlist.find(p => p.id === product.id)) {
      setWatchlist([...watchlist, product]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 max-w-md mx-auto relative pb-20">
      <HomeScreen
        onViewProduct={handleViewProduct}
        onAddToWatchlist={handleAddToWatchlist}
        watchlist={watchlist}
      />
      <TabBar currentScreen="home" onNavigate={(screen) => {
        if (screen === 'home') router.push('/');
        else router.push(`/${screen}`);
      }} />
    </div>
  );
}