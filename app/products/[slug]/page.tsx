import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

import ProductDetail from "./ProductDetail";

// ============================================================
// SITE CONFIG
// ============================================================

const SITE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://deepakkhiraenterprises.netlify.app";

const SITE_NAME = "Deepak Khira Enterprises";

// ============================================================
// PRODUCT TYPE
// ============================================================

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  inStock: boolean;
  images: string[];
  featured: boolean;
  status: "active" | "draft";
  rating: number;
  popularityScore: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// ============================================================
// PAGE PARAMS
// ============================================================

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// ============================================================
// GET PRODUCT DIRECTLY FROM MONGODB
// ============================================================
//
// Important:
// We do NOT call /api/products/[slug] from the server.
// This removes an unnecessary HTTP request.
//
// cache() allows generateMetadata() and the page to reuse
// the same request during the render.
// ============================================================

const getProduct = cache(async (slug: string): Promise<Product | null> => {
  const normalizedSlug = slug.trim().toLowerCase();

  if (!normalizedSlug) {
    return null;
  }

  try {
    await connectDB();

    const product = await Product.findOne({
      slug: normalizedSlug,
      status: "active",
    })
      .select(
        "_id name slug description category price stock inStock images featured status rating popularityScore createdAt updatedAt"
      )
      .lean();

    if (!product) {
      return null;
    }

    return {
      _id: String(product._id),
      name: String(product.name),
      slug: String(product.slug),
      description: String(product.description || ""),
      category: String(product.category || ""),
      price: Number(product.price || 0),
      stock: Number(product.stock || 0),
      inStock: Boolean(product.inStock),
      images: Array.isArray(product.images) ? product.images.map(String) : [],
      featured: Boolean(product.featured),
      status: product.status === "draft" ? "draft" : "active",
      rating: Number(product.rating || 0),
      popularityScore: Number(product.popularityScore || 0),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  } catch (error) {
    console.error(
      "PRODUCT PAGE DATABASE ERROR:",
      error instanceof Error ? error.message : error
    );

    return null;
  }
});

// ============================================================
// TEXT HELPERS
// ============================================================

function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function createDescription(description: string): string {
  const cleaned = cleanText(description);

  if (!cleaned) {
    return `Buy ${SITE_NAME} products online with reliable delivery across India.`;
  }

  if (cleaned.length <= 160) {
    return cleaned;
  }

  return `${cleaned.slice(0, 157)}...`;
}

// ============================================================
// DYNAMIC SEO METADATA
// ============================================================

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = await getProduct(slug);

  // ----------------------------------------------------------
  // PRODUCT NOT FOUND
  // ----------------------------------------------------------

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // ----------------------------------------------------------
  // PRODUCT SEO
  // ----------------------------------------------------------

  const productName = cleanText(product.name);

  const description = createDescription(product.description);

  const productUrl = `${SITE_URL}/products/${product.slug}`;

  const image = product.images?.[0] || `${SITE_URL}/business_logo.png`;

  return {
    title: productName,

    description,

    alternates: {
      canonical: productUrl,
    },

    robots: {
      index: product.status === "active",
      follow: true,

      googleBot: {
        index: product.status === "active",
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    openGraph: {
      type: "website",
      locale: "en_IN",
      url: productUrl,
      siteName: SITE_NAME,
      title: productName,
      description,

      images: [
        {
          url: image,
          width: 1200,
          height: 1200,
          alt: productName,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: productName,
      description,
      images: [image],
    },
  };
}

// ============================================================
// PRODUCT PAGE
// ============================================================

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await getProduct(slug);

  // ----------------------------------------------------------
  // 404
  // ----------------------------------------------------------

  if (!product) {
    notFound();
  }

  // ----------------------------------------------------------
  // URLS
  // ----------------------------------------------------------

  const productUrl = `${SITE_URL}/products/${product.slug}`;

  const productsUrl = `${SITE_URL}/products`;

  const categoryUrl = `${SITE_URL}/products?category=${encodeURIComponent(
    product.category
  )}`;

  const image = product.images?.[0] || `${SITE_URL}/business_logo.png`;

  // ==========================================================
  // PRODUCT STRUCTURED DATA
  // ==========================================================

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",

    "@id": `${productUrl}#product`,

    name: cleanText(product.name),

    description: cleanText(product.description),

    image: product.images?.length > 0 ? product.images : [image],

    sku: product._id,

    category: product.category,

    url: productUrl,

    offers: {
      "@type": "Offer",

      url: productUrl,

      priceCurrency: "INR",

      price: Number(product.price).toFixed(2),

      availability:
        product.inStock && product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",

      itemCondition: "https://schema.org/NewCondition",

      seller: {
        "@type": "Organization",

        "@id": `${SITE_URL}#organization`,

        name: SITE_NAME,

        url: SITE_URL,

        logo: {
          "@type": "ImageObject",

          url: `${SITE_URL}/business_logo.png`,
        },
      },
    },
  };

  // ==========================================================
  // BREADCRUMB SCHEMA
  // ==========================================================

  const breadcrumbSchema = {
    "@context": "https://schema.org",

    "@type": "BreadcrumbList",

    itemListElement: [
      {
        "@type": "ListItem",

        position: 1,

        name: "Home",

        item: SITE_URL,
      },

      {
        "@type": "ListItem",

        position: 2,

        name: "Products",

        item: productsUrl,
      },

      {
        "@type": "ListItem",

        position: 3,

        name: product.category,

        item: categoryUrl,
      },

      {
        "@type": "ListItem",

        position: 4,

        name: product.name,

        item: productUrl,
      },
    ],
  };

  // ==========================================================
  // WEBSITE / ORGANIZATION GRAPH
  // ==========================================================

  const websiteSchema = {
    "@context": "https://schema.org",

    "@type": "WebSite",

    "@id": `${SITE_URL}#website`,

    url: SITE_URL,

    name: SITE_NAME,

    publisher: {
      "@type": "Organization",

      "@id": `${SITE_URL}#organization`,

      name: SITE_NAME,

      url: SITE_URL,

      logo: {
        "@type": "ImageObject",

        url: `${SITE_URL}/business_logo.png`,
      },
    },
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>
      {/* PRODUCT STRUCTURED DATA */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />

      {/* BREADCRUMB STRUCTURED DATA */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* WEBSITE STRUCTURED DATA */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />

      {/* PRODUCT UI */}

      <ProductDetail product={product} />
    </>
  );
}
