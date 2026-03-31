import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@stackframe/stack", "rrweb"],
};

export default nextConfig;
