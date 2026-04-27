import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // API proxy handled by src/app/api/[...path]/route.ts
  // This supports long-running requests (pipeline takes 60-180s)
};

export default nextConfig;
