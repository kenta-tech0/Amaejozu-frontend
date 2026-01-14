
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 認証チェック（後でAPIに置き換え）
    const isAuthenticated = false; // TODO: 実際の認証状態を確認
    
    if (!isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
  }, []);

  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}