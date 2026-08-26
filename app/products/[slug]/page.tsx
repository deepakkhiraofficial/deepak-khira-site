import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import ProductDetail from "./ProductDetail";

// ============================================================
// SITE CONFIG
// ============================================================

const SITE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://deepakkhiraenterprises.netlify.app";

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

  createdAt?: string;

  updatedAt?: string;
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
// FETCH PRODUCT
// ============================================================
//
// cache() prevents duplicate fetching when
// generateMetadata() and the page both request
// the same product.
// ============================================================

const getProduct = cache(async (slug: string): Promise<Product | null> => {
  const normalizedSlug = slug.trim().toLowerCase();

  if (!normalizedSlug) {
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || SITE_URL;

  try {
    const response = await fetch(
      `${baseUrl}/api/products/${encodeURIComponent(normalizedSlug)}`,
      {
        next: {
          revalidate: 300,

          tags: [`product-${normalizedSlug}`],
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data?.success || !data?.product) {
      return null;
    }

    return data.product as Product;
  } catch (error) {
    console.error("PRODUCT FETCH ERROR:", error);

    return null;
  }
});

// ============================================================
// TEXT HELPERS
// ============================================================

function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function createDescription(description: string, productName: string): string {
  const cleaned = cleanText(description);

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

  const description = createDescription(product.description, productName);

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

    name: product.name,

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

        name: SITE_NAME,

        url: SITE_URL,
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
  // ORGANIZATION / WEBSITE GRAPH
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

  return (
    <>
      {/* ======================================================
          PRODUCT SCHEMA
      ======================================================= */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />

      {/* ======================================================
          BREADCRUMB SCHEMA
      ======================================================= */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* ======================================================
          WEBSITE SCHEMA
      ======================================================= */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />

      {/* ======================================================
          PRODUCT UI
      ======================================================= */}

      <ProductDetail product={product} />
    </>
  );
}
