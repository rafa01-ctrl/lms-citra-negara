import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  turbopack: {
    // Root project ada di folder ini, bukan di C:\Users\PC-1
    root: __dirname,
  },
};

export default nextConfig;
