'use client';

import { Home, Search, Heart, Settings } from 'lucide-react';

interface TabBarProps {
  currentScreen: string;
  onNavigate: (screen: 'home' | 'search' | 'watchlist' | 'settings') => void;
}

export function TabBar({ currentScreen, onNavigate }: TabBarProps) {
  const tabs = [
    { id: 'home', label: 'ホーム', icon: Home },
    { id: 'search', label: '検索', icon: Search },
    { id: 'watchlist', label: 'リスト', icon: Heart },
    { id: 'settings', label: '設定', icon: Settings },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 max-w-md mx-auto">
      <div className="grid grid-cols-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentScreen === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id as any)}
              className={`flex flex-col items-center gap-1 py-2 transition-colors ${
                isActive 
                  ? 'text-orange-500' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
