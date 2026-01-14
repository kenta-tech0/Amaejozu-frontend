
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { WatchlistScreen } from '@/components/Watchlist/WatchlistScreen';
import { TabBar } from '@/components/navigation/TabBar';
import { Product } from '@/types/product';

export default function WatchlistPage() {
  const router = useRouter();
  const [watchlist, setWatchlist] = useState<Product[]>([]);

  const handleViewProduct = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  const handleRemoveFromWatchlist = (productId: string) => {
    setWatchlist(watchlist.filter(p => p.id !== productId));
  };

  const handleNavigateToSearch = () => {
    router.push('/search');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 max-w-md mx-auto relative pb-20">
      <WatchlistScreen
        watchlist={watchlist}
        onViewProduct={handleViewProduct}
        onRemoveFromWatchlist={handleRemoveFromWatchlist}
        onNavigateToSearch={handleNavigateToSearch}
      />
      <TabBar currentScreen="watchlist" onNavigate={(screen) => {
        if (screen === 'home') router.push('/');
        else router.push(`/${screen}`);
      }} />
    </div>
  );
}