import { useState } from 'react';
import { Product } from '../../App';
import { Search, SlidersHorizontal, Plus } from 'lucide-react';
import Image from 'next/image';

interface SearchScreenProps {
  onViewProduct: (product: Product) => void;
  onAddToWatchlist: (product: Product) => void;
  watchlist: Product[];
}

const categories = [
  'すべて', '化粧水', '洗顔料', 'オールインワン', '乳液', 
  '日焼け止め', 'シェービング', 'アイケア', 'ヘアケア'
];

const mockSearchProducts: Product[] = [
  {
    id: 's1',
    name: 'バルクオム THE FACE WASH 洗顔料 100g',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
    currentPrice: 1980,
    originalPrice: 2200,
    discount: 10,
    shop: 'Amazon',
    category: '洗顔料',
    brand: 'BULK HOMME',
    skinType: ['全ての肌タイプ'],
    priceHistory: [{ date: '2024-12-21', price: 1980 }],
  },
  {
    id: 's2',
    name: 'ウーノ ホイップウォッシュ モイスト 130g',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
    currentPrice: 480,
    originalPrice: 660,
    discount: 27,
    shop: '楽天市場',
    category: '洗顔料',
    brand: 'UNO',
    skinType: ['乾燥肌'],
    priceHistory: [{ date: '2024-12-21', price: 480 }],
  },
  {
    id: 's3',
    name: 'ニベアメン フェイスウォッシュ フレッシュ 100g',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
    currentPrice: 398,
    originalPrice: 550,
    discount: 28,
    shop: 'Amazon',
    category: '洗顔料',
    brand: 'ニベアメン',
    skinType: ['脂性肌'],
    priceHistory: [{ date: '2024-12-21', price: 398 }],
  },
  {
    id: 's4',
    name: 'オルビス ミスター スキンジェルローション 150ml',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
    currentPrice: 1650,
    originalPrice: 1980,
    discount: 17,
    shop: 'ORBIS公式',
    category: 'オールインワン',
    brand: 'ORBIS',
    skinType: ['全ての肌タイプ'],
    priceHistory: [{ date: '2024-12-21', price: 1650 }],
  },
  {
    id: 's5',
    name: 'DHC MEN オールインワン モイスチュアジェル 200ml',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop',
    currentPrice: 1680,
    originalPrice: 2200,
    discount: 24,
    shop: 'DHC公式',
    category: 'オールインワン',
    brand: 'DHC',
    skinType: ['乾燥肌'],
    priceHistory: [{ date: '2024-12-21', price: 1680 }],
  },
  {
    id: 's6',
    name: 'マンダム ルシード 薬用ローション 140ml',
    image: 'https://images.unsplash.com/photo-1556228852-80c3a083d572?w=400&h=400&fit=crop',
    currentPrice: 980,
    originalPrice: 1430,
    discount: 31,
    shop: '楽天市場',
    category: '化粧水',
    brand: 'ルシード',
    skinType: ['全ての肌タイプ'],
    priceHistory: [{ date: '2024-12-21', price: 980 }],
  },
  {
    id: 's7',
    name: 'クワトロボタニコ オイルコントロール & フェイスクレンザー 120g',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
    currentPrice: 1680,
    originalPrice: 2200,
    discount: 24,
    shop: 'Yahoo!ショッピング',
    category: '洗顔料',
    brand: 'クワトロボタニコ',
    skinType: ['脂性肌'],
    priceHistory: [{ date: '2024-12-21', price: 1680 }],
  },
  {
    id: 's8',
    name: 'アラミス ラボシリーズ マックス LS V クリーム 50ml',
    image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=400&fit=crop',
    currentPrice: 6800,
    originalPrice: 8800,
    discount: 23,
    shop: 'Amazon',
    category: '乳液',
    brand: 'ラボシリーズ',
    skinType: ['乾燥肌'],
    priceHistory: [{ date: '2024-12-21', price: 6800 }],
  },
  {
    id: 's9',
    name: 'ギャツビー プレミアムタイプ デオドラントボディウォーター 170ml',
    image: '',
    currentPrice: 580,
    originalPrice: 880,
    discount: 34,
    shop: 'Amazon',
    category: 'ボディケア',
    brand: 'GATSBY',
    skinType: ['全ての肌タイプ'],
    priceHistory: [{ date: '2024-12-21', price: 580 }],
  },
  {
    id: 's10',
    name: 'シック ハイドロ5 プレミアム パワーセレクト 替刃4個',
    image: '',
    currentPrice: 1480,
    originalPrice: 2200,
    discount: 33,
    shop: '楽天市場',
    category: 'シェービング',
    brand: 'Schick',
    skinType: ['全ての肌タイプ'],
    priceHistory: [{ date: '2024-12-21', price: 1480 }],
  },
  {
    id: 's11',
    name: 'ロート製薬 OXY パーフェクトウォッシュ 泡タイプ 150ml',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
    currentPrice: 498,
    originalPrice: 715,
    discount: 30,
    shop: 'Amazon',
    category: '洗顔料',
    brand: 'OXY',
    skinType: ['脂性肌'],
    priceHistory: [{ date: '2024-12-21', price: 498 }],
  },
  {
    id: 's12',
    name: '花王 サクセス 薬用シェービングジェル 180g',
    image: '',
    currentPrice: 520,
    originalPrice: 770,
    discount: 32,
    shop: 'Yahoo!ショッピング',
    category: 'シェービング',
    brand: 'サクセス',
    skinType: ['全ての肌タイプ'],
    priceHistory: [{ date: '2024-12-21', price: 520 }],
  },
];

export function SearchScreen({ onViewProduct, onAddToWatchlist, watchlist }: SearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('すべて');
  const [sortBy, setSortBy] = useState<'discount' | 'price'>('discount');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<'all' | 'under1000' | '1000-3000' | 'over3000'>('all');

  const filteredProducts = mockSearchProducts
    .filter(product => {
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'すべて' || 
        product.category === selectedCategory;
      
      let matchesPrice = true;
      if (priceRange === 'under1000') {
        matchesPrice = product.currentPrice < 1000;
      } else if (priceRange === '1000-3000') {
        matchesPrice = product.currentPrice >= 1000 && product.currentPrice <= 3000;
      } else if (priceRange === 'over3000') {
        matchesPrice = product.currentPrice > 3000;
      }
      
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'discount') {
        return b.discount - a.discount;
      } else {
        return a.currentPrice - b.currentPrice;
      }
    });

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 pt-6 pb-4">
        <h1 className="text-2xl text-slate-900 dark:text-white mb-4">商品検索</h1>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="商品名やブランドで検索..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Filter Button */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
              showFilters
                ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-500 border border-orange-500'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm">フィルター</span>
          </button>
          <button
            onClick={() => setSortBy(sortBy === 'discount' ? 'price' : 'discount')}
            className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
          >
            {sortBy === 'discount' ? '割引率順' : '価格順'}
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">価格帯</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'すべて' },
                  { value: 'under1000', label: '1,000円以下' },
                  { value: '1000-3000', label: '1,000-3,000円' },
                  { value: 'over3000', label: '3,000円以上' },
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setPriceRange(option.value as any)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      priceRange === option.value
                        ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-500 border border-orange-500'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="px-6 pt-4 pb-2 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="px-6 pt-4">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          {filteredProducts.length}件の商品
        </p>

        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map(product => {
            const isInWatchlist = watchlist.some(p => p.id === product.id);
            
            return (
              <div
                key={product.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 hover:border-orange-500 dark:hover:border-orange-500 transition-colors cursor-pointer"
                onClick={() => onViewProduct(product)}
              >
                <div className="relative mb-3">
                  {product.image ? (
                    <Image
                      src={product.image || 'https://placehold.co/400x400?text=No+Image'}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="w-full aspect-square object-cover rounded-xl"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const placeholder = target.nextElementSibling as HTMLElement;
                        if (placeholder) placeholder.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`${product.image ? 'hidden' : 'flex'} w-full aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl items-center justify-center`}
                  >
                    <span className="text-slate-400 dark:text-slate-500 text-xs">No Photo</span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isInWatchlist) {
                          onAddToWatchlist(product);
                        }
                      }}
                      disabled={isInWatchlist}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-sm transition-colors ${
                        isInWatchlist
                          ? 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-400 cursor-not-allowed'
                          : 'bg-white/80 dark:bg-slate-900/80 text-orange-500 hover:bg-white dark:hover:bg-slate-900'
                      }`}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-lg">
                      {product.discount}%OFF
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  {product.brand}
                </p>

                <h3 className="text-sm text-slate-900 dark:text-white line-clamp-2 mb-2 min-h-[2.5rem]">
                  {product.name}
                </h3>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-slate-900 dark:text-white">
                      ¥{product.currentPrice.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 line-through">
                    ¥{product.originalPrice.toLocaleString()}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  {product.shop}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}