import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => [
    {
      source: "/forum/:path*",
      destination: "/",
    },
  ],
};

export default nextConfig;
