import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // 開発用
      },
      {
        protocol: 'https',
        hostname: 'placehold.co', // フォールバック用
      },
      // 本番用（楽天画像） - 必要になったらコメント解除
      // {
      //   protocol: 'https',
      //   hostname: 'thumbnail.image.rakuten.co.jp',
      // },
    ],
  },
};

export default nextConfig;