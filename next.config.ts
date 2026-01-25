import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "thumbnail.image.rakuten.co.jp", // 追加
      },
      {
        protocol: "https",
        hostname: "image.rakuten.co.jp", // 追加
      },
    ],
  },
};

export default nextConfig;
