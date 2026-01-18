'use client'

import { useRouter } from 'next/navigation';
import { SettingsScreen } from '@/components/Settings/SettingsScreen';
import { TabBar } from '@/components/navigation/TabBar';

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 max-w-md mx-auto relative pb-20">
      <SettingsScreen />
      <TabBar currentScreen="settings" onNavigate={(screen) => {
        if (screen === 'home') router.push('/');
        else router.push(`/${screen}`);
      }} />
    </div>
  );
}