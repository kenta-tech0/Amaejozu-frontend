import { Product } from '../../App';
import { ArrowLeft, Heart, ExternalLink, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProductDetailScreenProps {
  product: Product;
  onBack: () => void;
  onAddToWatchlist: (product: Product) => void;
  isInWatchlist: boolean;
}

export function ProductDetailScreen({ 
  product, 
  onBack, 
  onAddToWatchlist,
  isInWatchlist 
}: ProductDetailScreenProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const formatPrice = (value: number) => {
    return `¥${(value / 1000).toFixed(0)}k`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{label}</p>
          <p className="text-slate-900 dark:text-white">
            ¥{payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 pt-6 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-900 dark:text-white" />
          </button>
          <h1 className="flex-1 text-slate-900 dark:text-white">商品詳細</h1>
          <button
            onClick={() => !isInWatchlist && onAddToWatchlist(product)}
            disabled={isInWatchlist}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${
              isInWatchlist
                ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-500'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Heart className={`w-5 h-5 ${isInWatchlist ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pt-6 space-y-6">
        {/* Image */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
          <img
            src={product.image || 'https://placehold.co/400x400?text=No+Image'}
            alt={product.name}
            className="w-full aspect-square object-cover"
          />
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-start gap-2 mb-2">
            <span className="px-2 py-1 bg-red-500 text-white text-sm rounded-lg">
              {product.discount}%OFF
            </span>
            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm rounded-lg">
              {product.category}
            </span>
          </div>
          {product.brand && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
              {product.brand}
            </p>
          )}
          <h2 className="text-xl text-slate-900 dark:text-white mb-2">
            {product.name}
          </h2>
          {product.skinType && product.skinType.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {product.skinType.map((type) => (
                <span 
                  key={type}
                  className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded-lg"
                >
                  {type}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-3xl text-slate-900 dark:text-white">
              ¥{product.currentPrice.toLocaleString()}
            </span>
            <span className="text-slate-400 line-through">
              ¥{product.originalPrice.toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-green-600 dark:text-green-400">
            ¥{(product.originalPrice - product.currentPrice).toLocaleString()}お得
          </p>
        </div>

        {/* Shop Info */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">販売ショップ</p>
              <p className="text-slate-900 dark:text-white">{product.shop}</p>
            </div>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors"
            >
              <span>購入する</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Price Chart */}
        {product.priceHistory && product.priceHistory.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
            <h3 className="text-slate-900 dark:text-white mb-4">価格推移（過去30日）</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={product.priceHistory.map(item => ({
                    date: formatDate(item.date),
                    price: item.price,
                  }))}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                  <XAxis
                    dataKey="date"
                    className="text-slate-600 dark:text-slate-400"
                    tick={{ fill: 'currentColor', fontSize: 12 }}
                  />
                  <YAxis
                    tickFormatter={formatPrice}
                    className="text-slate-600 dark:text-slate-400"
                    tick={{ fill: 'currentColor', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={{ fill: '#f97316', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* AI Recommendation */}
        {product.aiReason && (
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-slate-900 dark:text-white">なぜおすすめ？</h3>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {product.aiReason}
            </p>
          </div>
        )}

        {/* Add to Watchlist */}
        {!isInWatchlist && (
          <button
            onClick={() => onAddToWatchlist(product)}
            className="w-full flex items-center justify-center gap-2 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors"
          >
            <Heart className="w-5 h-5" />
            <span>ウォッチリストに追加</span>
          </button>
        )}
      </div>
    </div>
  );
}