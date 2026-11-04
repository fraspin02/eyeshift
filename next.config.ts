import type { NextConfig } from "next";

const isExport = process.env.EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  ...(isExport ? { output: "export", trailingSlash: true } : {}),
  basePath,
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    unoptimized: isExport,
    formats: ["image/avif", "image/webp"],
  },
  transpilePackages: ["three"],
};

export default nextConfig;
