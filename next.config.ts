import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: false,
  },
  reactStrictMode: true,
  allowedDevOrigins: ['http://localhost:3000','10.243.165.43:3000',"http://deepakkhiraenterprises.in","https://deepakkhiraenterprises.in"],

  /* config options here */

  // ⚡ Performance
  compress: true,
  poweredByHeader: false,

  // ⚡ Image Optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  // ⚡ Caching
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      'lodash',
      'date-fns',
    ],
  },

  // ⚡ Security Headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
    ];
  },
};



export default nextConfig;
