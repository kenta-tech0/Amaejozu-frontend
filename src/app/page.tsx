// Amaejozu-frontend/src/app/page.tsx (テスト用)
'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [status, setStatus] = useState('接続中...');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/app/api/health`)
      .then(res => res.json())
      .then(data => setStatus(`✅ ${data.message}`))
      .catch(err => setStatus(`❌ エラー: ${err.message}`));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Amaejozu 統合テスト</h1>
      <p>Backend接続状態: {status}</p>
    </div>
  );
}