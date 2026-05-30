import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: false, // ✅ reduce extra render checks

  output: "standalone", // ✅ best for Docker (VERY IMPORTANT)
  
  typescript: {
    ignoreBuildErrors: true, // ⚠️ optional (skip type check)
  },

  images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**.filebase.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "**.myfilebase.com",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
