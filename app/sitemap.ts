import type { MetadataRoute } from "next";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

const SITE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://deepakkhiraenterprises.netlify.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // ============================================================
  // DATABASE
  // ============================================================

  let products: Array<{
    slug?: string;
    updatedAt?: Date | string;
  }> = [];

  try {
    await connectDB();

    products = await Product.find({
      status: "active",
      slug: {
        $exists: true,
        $ne: "",
      },
    })
      .select("slug updatedAt")
      .lean();
  } catch (error) {
    console.error("SITEMAP PRODUCT FETCH ERROR:", error);

    // Static sitemap should still work
    // even if MongoDB is temporarily unavailable.
    products = [];
  }

  // ============================================================
  // STATIC PAGES
  // ============================================================

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },

    {
      url: `${SITE_URL}/products`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },

    {
      url: `${SITE_URL}/services`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    {
      url: `${SITE_URL}/blogs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },

    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },

    {
      url: `${SITE_URL}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },

    {
      url: `${SITE_URL}/shipping-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },

    {
      url: `${SITE_URL}/refund-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },

    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },

    {
      url: `${SITE_URL}/security-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },

    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },

    {
      url: `${SITE_URL}/terms-and-conditions`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // ============================================================
  // PRODUCT PAGES
  // ============================================================

  const productPages: MetadataRoute.Sitemap = products
    .filter(
      (product) =>
        typeof product.slug === "string" &&
        product.slug.trim().length > 0
    )
    .map((product) => ({
      url: `${SITE_URL}/products/${product.slug}`,

      lastModified: product.updatedAt
        ? new Date(product.updatedAt)
        : now,

      changeFrequency: "weekly" as const,

      priority: 0.9,
    }));

  // ============================================================
  // FINAL SITEMAP
  // ============================================================

  return [
    ...staticPages,
    ...productPages,
  ];
}