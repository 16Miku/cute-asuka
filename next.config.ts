import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静态导出配置，用于部署到 Render 等平台
  output: "export",
  distDir: "dist",
  // 允许图片使用 unoptimized 模式（静态导出必需）
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
