import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://deepak-khira-enterprises.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/dashboard/",
          "/account/",
          "/checkout/",
          "/cart/",
          "/orders/",
          "/login/",
          "/signup/",
        ],
      },
    ],

    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}