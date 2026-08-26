/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ============================================================
  // PERFORMANCE
  // ============================================================

  compress: true,
  poweredByHeader: false,

  // ============================================================
  // IMAGE OPTIMIZATION
  // ============================================================

  images: {
    formats: ["image/avif", "image/webp"],

    minimumCacheTTL: 60 * 60 * 24 * 30,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  // ============================================================
  // EXPERIMENTAL
  // ============================================================

  experimental: {
    optimizeCss: true,

    optimizePackageImports: ["lucide-react", "lodash", "date-fns"],
  },

  // ============================================================
  // SECURITY HEADERS
  // ============================================================

  async headers() {
    return [
      {
        source: "/(.*)",

        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },

          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },

          {
            key: "X-Frame-Options",
            value: "DENY",
          },

          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },

          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },

          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
