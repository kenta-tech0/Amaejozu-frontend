'use client'

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ProductDetailScreen } from '@/components/ProductDetail/ProductDetailScreen';
import { Product } from '@/types/product';
import { mockProducts } from '@/lib/api/mock-data';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [watchlist, setWatchlist] = useState<Product[]>([]);

  useEffect(() => {
    // IDから商品を取得（後でAPIに置き換え）
    const foundProduct = mockProducts.find(p => p.id === params.id);
    setProduct(foundProduct || null);
  }, [params.id]);

  const handleBack = () => {
    router.back();
  };

  const handleAddToWatchlist = (product: Product) => {
    if (watchlist.length < 50 && !watchlist.find(p => p.id === product.id)) {
      setWatchlist([...watchlist, product]);
    }
  };

  if (!product) {
    return <div>商品が見つかりません</div>;
  }

  return (
    <ProductDetailScreen
      product={product}
      onBack={handleBack}
      onAddToWatchlist={handleAddToWatchlist}
      isInWatchlist={!!watchlist.find(p => p.id === product.id)}
    />
  );
}