import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@stackframe/stack", "rrweb"],
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;
