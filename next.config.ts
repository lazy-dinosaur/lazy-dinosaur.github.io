import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    domains: ["user-images.githubusercontent.com", "lazy-dinosaur.github.io"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lazy-dinosaur.github.io",
      },
    ],
    formats: ["image/webp"],
    // Remove unoptimized: true to enable image optimization
  },
  trailingSlash: true, // ✅ 정적 서버 라우팅 호환성
  /* config options here */
  basePath: "",
};

export default nextConfig;
