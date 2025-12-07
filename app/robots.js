import { MetadataRoute } from "next";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/dashboard/", "/private/", "/api/private/"],
    },
    sitemap: "https://deepakkhiraenterprises.com/sitemap.xml",
    host: "https://deepakkhiraenterprises.com",
  };
}
