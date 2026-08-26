// app/products/page.tsx

import type { Metadata } from "next";
import { Suspense } from "react";
import ProductsPageClient from "./ProductsPageClient";

// ============================================================
// SITE CONFIG
// ============================================================

const SITE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://deepak-khira-enterprises.in";

const SITE_NAME = "Deepak Khira Enterprises";

const PAGE_TITLE = "Products | Deepak Khira Enterprises";

const PAGE_DESCRIPTION =
  "Shop quality products from Deepak Khira Enterprises. Browse electronics, hair care, personal care and other products with reliable delivery across India.";

// ============================================================
// SEO METADATA
// ============================================================

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: PAGE_TITLE,

  description: PAGE_DESCRIPTION,

  keywords: [
    "Deepak Khira Enterprises",
    "Deepak Khira products",
    "products online India",
    "online shopping India",
    "buy products online",
    "electronics products India",
    "hair care products India",
    "personal care products India",
    "quality products India",
    "online seller India",
  ],

  alternates: {
    canonical: `${SITE_URL}/products`,
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: `${SITE_URL}/products`,
    siteName: SITE_NAME,
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,

    images: [
      {
        url: `${SITE_URL}/business_logo.png`,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [`${SITE_URL}/business_logo.png`],
  },
};

// ============================================================
// STRUCTURED DATA
// ============================================================

function ProductsStructuredData() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: "Official website of Deepak Khira Enterprises.",

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

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/products#collection`,
    url: `${SITE_URL}/products`,
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,

    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      url: SITE_URL,
      name: SITE_NAME,
    },

    about: {
      "@type": "Thing",
      name: "Products",
    },
  };

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
        item: `${SITE_URL}/products`,
      },
    ],
  };

  return (
    <>
      {/* WEBSITE SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />

      {/* COLLECTION PAGE SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema),
        }}
      />

      {/* BREADCRUMB SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  );
}

// ============================================================
// LOADING FALLBACK
// ============================================================

function ProductsLoading() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

        <p className="text-sm text-gray-500">Loading products...</p>
      </div>
    </div>
  );
}

// ============================================================
// PRODUCTS PAGE
// ============================================================

export default function ProductsPage() {
  return (
    <>
      <ProductsStructuredData />

      <Suspense fallback={<ProductsLoading />}>
        <ProductsPageClient />
      </Suspense>
    </>
  );
}
