"use client";

import { useState } from "react";
import { X, Target, Loader2 } from "lucide-react";

interface TargetPriceDialogProps {
  productName: string;
  currentPrice: number;
  onConfirm: (targetPrice: number | null) => Promise<void>;
  onCancel: () => void;
}

export function TargetPriceDialog({
  productName,
  currentPrice,
  onConfirm,
  onCancel,
}: TargetPriceDialogProps) {
  const [targetPrice, setTargetPrice] = useState<string>("");
  const [skipTarget, setSkipTarget] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (isSubmitting) return; // 二重送信防止
    
    setIsSubmitting(true);
    try {
      if (skipTarget || !targetPrice) {
        await onConfirm(null);
      } else {
        const price = parseInt(targetPrice, 10);
        if (!isNaN(price) && price > 0) {
          await onConfirm(price);
        } else {
          await onConfirm(null);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const suggestedPrices = [
    Math.floor(currentPrice * 0.9), // 10%OFF
    Math.floor(currentPrice * 0.8), // 20%OFF
    Math.floor(currentPrice * 0.7), // 30%OFF
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg text-slate-900 dark:text-white">目標価格を設定</h2>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            {productName}
          </p>

          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">現在価格</p>
            <p className="text-xl text-slate-900 dark:text-white">
              ¥{currentPrice.toLocaleString()}
            </p>
          </div>

          {!skipTarget && (
            <>
              {/* 目標価格入力 */}
              <div>
                <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">
                  目標価格
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">¥</span>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    placeholder="目標価格を入力"
                    className="w-full pl-8 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* 推奨価格 */}
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">おすすめ目標</p>
                <div className="flex gap-2">
                  {suggestedPrices.map((price, index) => (
                    <button
                      key={price}
                      onClick={() => setTargetPrice(price.toString())}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm transition-colors ${
                        targetPrice === price.toString()
                          ? "bg-orange-500 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      <div className="text-xs opacity-70">{(index + 1) * 10}%OFF</div>
                      <div>¥{price.toLocaleString()}</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* スキップオプション */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={skipTarget}
              onChange={(e) => setSkipTarget(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
            />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              目標価格を設定しない
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex gap-3">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            キャンセル
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>追加中...</span>
              </>
            ) : (
              <span>追加する</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
