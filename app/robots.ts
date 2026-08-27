import type { MetadataRoute } from "next";

const SITE_URL = "https://deepakkhiraenterprises.netlify.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
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
        "/thank-you/",
      ],
    },

    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}