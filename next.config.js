/** @type {import('next').NextConfig} */
const nextConfig = {
  // ============================================================
  // CORE
  // ============================================================

  reactStrictMode: true,

  // Compress server responses.
  compress: true,

  // Hide Next.js signature.
  poweredByHeader: false,

  // ============================================================
  // IMAGE OPTIMIZATION
  // ============================================================

  images: {
    // Prefer modern image formats.
    formats: ["image/avif", "image/webp"],

    // Cache optimized images for 30 days.
    minimumCacheTTL: 60 * 60 * 24 * 30,

    // Prevent unnecessarily huge generated images.
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1440, 1920],

    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

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
  // EXPERIMENTAL PERFORMANCE
  // ============================================================

  experimental: {
    optimizeCss: true,

    optimizePackageImports: ["lucide-react", "lodash", "date-fns"],
  },

  // ============================================================
  // SECURITY + PERFORMANCE HEADERS
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
