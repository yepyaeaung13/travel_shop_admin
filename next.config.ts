import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
