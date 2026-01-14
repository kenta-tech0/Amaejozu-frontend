'use client';

import { useState } from 'react';
import { TrendingDown, Sparkles, Tag } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const categories = [
  '化粧水', '乳液・クリーム', '美容液', 'クレンジング',
  '洗顔料', 'パック・マスク', 'アイケア', 'リップケア',
  '日焼け止め', 'オールインワン', 'ボディケア', 'ヘアケア'
];

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleNext = () => {
    if (currentPage < 2) {
      setCurrentPage(currentPage + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    if (currentPage === 2) {
      onComplete();
    } else {
      setCurrentPage(2);
    }
  };

  const pages = [
    {
      icon: <TrendingDown className="w-20 h-20 text-white" strokeWidth={2} />,
      title: '公式ショップの値下がりを通知',
      description: 'Amazon、楽天市場など主要ECサイトの価格を毎日チェック。お気に入り商品が値下がりしたら即座に通知します。',
      bgColor: 'bg-orange-500',
    },
    {
      icon: <Sparkles className="w-20 h-20 text-white" strokeWidth={2} />,
      title: '毎日TOP10をAIが自動選定',
      description: 'AIが価格推移や割引率を分析。今買うべき商品をランキング形式でお届けします。',
      bgColor: 'bg-purple-500',
    },
    {
      icon: <Tag className="w-20 h-20 text-white" strokeWidth={2} />,
      title: '興味のあるジャンルを選択',
      description: '選択したジャンルの情報を優先的にお届けします。あとから変更することもできます。',
      bgColor: 'bg-blue-500',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col max-w-md mx-auto">
      {/* Skip Button */}
      <div className="flex justify-end px-6 pt-6">
        <button
          onClick={handleSkip}
          className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          スキップ
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        {currentPage < 2 ? (
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-32 h-32 ${pages[currentPage].bgColor} rounded-full mb-8`}>
              {pages[currentPage].icon}
            </div>
            <h2 className="text-2xl text-slate-900 dark:text-white mb-4">
              {pages[currentPage].title}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed px-4">
              {pages[currentPage].description}
            </p>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-32 h-32 ${pages[2].bgColor} rounded-full mb-8`}>
                {pages[2].icon}
              </div>
              <h2 className="text-2xl text-slate-900 dark:text-white mb-4">
                {pages[2].title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                {pages[2].description}
              </p>
            </div>

            {/* Category Selection */}
            <div className="grid grid-cols-3 gap-3">
              {categories.map((category) => {
                const isSelected = selectedCategories.includes(category);
                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={`py-3 px-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500 text-orange-600 dark:text-orange-400'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mb-8">
        {[0, 1, 2].map((page) => (
          <div
            key={page}
            className={`w-2 h-2 rounded-full transition-all ${
              page === currentPage
                ? 'bg-orange-500 w-8'
                : 'bg-slate-300 dark:bg-slate-700'
            }`}
          />
        ))}
      </div>

      {/* Next Button */}
      <div className="px-6 pb-8">
        <button
          onClick={handleNext}
          disabled={currentPage === 2 && selectedCategories.length === 0}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
        >
          {currentPage === 2 ? '始める' : '次へ'}
        </button>
      </div>
    </div>
  );
}