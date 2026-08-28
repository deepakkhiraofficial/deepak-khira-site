import type { Metadata } from "next";
import Script from "next/script";

import Hero from "@/components/sections/Hero";
import AboutUs from "@/components/sections/AboutUs";
import ProductsSection from "@/components/sections/ProductsSection";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import WhatsAppButton from "@/components/sections/WhatsAppButton";
import NewsletterForm from "@/components/sections/NewsletterForm";
import Link from "next/link";

// ============================================================
// SITE CONFIG
// ============================================================

const SITE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://deepakkhiraenterprises.netlify.app";

const SITE_NAME = "Deepak Khira Enterprises";

const SITE_DESCRIPTION =
  "Deepak Khira Enterprises is an India-based e-commerce and business enterprise offering quality products, wholesale supply, distribution, trading and digital business solutions.";

const SITE_PHONE = "+91-9109001109";

const SITE_EMAIL = "deepakkhiraenterprises@gmail.com";

// ============================================================
// METADATA
// ============================================================

export const metadata: Metadata = {
  title: "Deepak Khira Enterprises | Online Shopping & Business Solutions",

  description: SITE_DESCRIPTION,

  keywords: [
    "Deepak Khira Enterprises",
    "Deepak Khira",
    "online shopping India",
    "e-commerce India",
    "quality products India",
    "wholesale supplier India",
    "product distributor India",
    "online seller India",
    "digital business solutions",
    "business solutions India",
  ],

  authors: [
    {
      name: SITE_NAME,
      url: SITE_URL,
    },
  ],

  creator: SITE_NAME,
  publisher: SITE_NAME,

  metadataBase: new URL(SITE_URL),

  alternates: {
    canonical: "/",
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

    url: SITE_URL,

    siteName: SITE_NAME,

    title: "Deepak Khira Enterprises | Online Shopping & Business Solutions",

    description: SITE_DESCRIPTION,

    images: [
      {
        url: "/business_logo.png",
        width: 1200,
        height: 630,
        alt: "Deepak Khira Enterprises",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Deepak Khira Enterprises | Online Shopping & Business Solutions",

    description: SITE_DESCRIPTION,

    images: ["/business_logo.png"],
  },

  category: "ecommerce",
};

// ============================================================
// ORGANIZATION SCHEMA
// ============================================================

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",

  "@id": `${SITE_URL}/#organization`,

  name: SITE_NAME,

  url: SITE_URL,

  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/business_logo.png`,
  },

  description: SITE_DESCRIPTION,

  telephone: SITE_PHONE,

  email: SITE_EMAIL,

  address: {
    "@type": "PostalAddress",
    addressLocality: "Dabra",
    addressRegion: "Madhya Pradesh",
    postalCode: "475110",
    addressCountry: "IN",
  },

  contactPoint: {
    "@type": "ContactPoint",
    telephone: SITE_PHONE,
    contactType: "customer support",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi"],
  },
};

// ============================================================
// WEBSITE SCHEMA
// ============================================================

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",

  "@id": `${SITE_URL}/#website`,

  name: SITE_NAME,

  url: SITE_URL,

  description: SITE_DESCRIPTION,

  publisher: {
    "@id": `${SITE_URL}/#organization`,
  },

  inLanguage: "en-IN",
};

// ============================================================
// ONLINE STORE SCHEMA
// ============================================================

const storeSchema = {
  "@context": "https://schema.org",
  "@type": "OnlineStore",

  "@id": `${SITE_URL}/#store`,

  name: SITE_NAME,

  url: SITE_URL,

  logo: `${SITE_URL}/business_logo.png`,

  image: `${SITE_URL}/business_logo.png`,

  description: SITE_DESCRIPTION,

  telephone: SITE_PHONE,

  email: SITE_EMAIL,

  address: {
    "@type": "PostalAddress",
    addressLocality: "Dabra",
    addressRegion: "Madhya Pradesh",
    postalCode: "475110",
    addressCountry: "IN",
  },

  areaServed: {
    "@type": "Country",
    name: "India",
  },
};

// ============================================================
// HOME PAGE
// ============================================================

export default function Home() {
  return (
    <>
      {/* ======================================================
          ORGANIZATION STRUCTURED DATA
      ======================================================= */}

      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />

      {/* ======================================================
          WEBSITE STRUCTURED DATA
      ======================================================= */}

      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />

      {/* ======================================================
          ONLINE STORE STRUCTURED DATA
      ======================================================= */}

      <Script
        id="store-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(storeSchema),
        }}
      />

      <main className="min-h-screen overflow-x-hidden bg-white text-slate-900">
        {/* ====================================================
            HERO
        ===================================================== */}

        <section aria-label="Deepak Khira Enterprises">
          <Hero />
        </section>

        {/* ====================================================
            TRUST BAR
        ===================================================== */}

        <section
          aria-label="Why shop with Deepak Khira Enterprises"
          className="border-y border-slate-200 bg-white"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
            {[
              {
                title: "Quality Products",
                text: "Carefully selected products",
              },
              {
                title: "Secure Shopping",
                text: "Safe and reliable checkout",
              },
              {
                title: "Fast Delivery",
                text: "Delivery across India",
              },
              {
                title: "Customer Support",
                text: "Support when you need it",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="border-b border-slate-100 px-5 py-6 text-center last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
              >
                <h2 className="text-sm font-semibold text-slate-900">
                  {item.title}
                </h2>

                <p className="mt-1 text-xs text-slate-500">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ====================================================
            FEATURED PRODUCTS
        ===================================================== */}

        <section id="products" aria-labelledby="featured-products-heading">
          <h2 id="featured-products-heading" className="sr-only">
            Featured Products
          </h2>

          <ProductsSection />
        </section>

        {/* ====================================================
            BUSINESS INTRODUCTION
        ===================================================== */}

        <section
          id="business"
          aria-labelledby="business-heading"
          className="border-y border-slate-200 bg-slate-50"
        >
          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                  About Our Business
                </p>

                <h2
                  id="business-heading"
                  className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl"
                >
                  More than an online store.
                </h2>

                <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
                  Deepak Khira Enterprises operates across e-commerce,
                  wholesale, distribution, trading and digital business
                  activities. Our goal is simple — provide reliable products and
                  build long-term customer relationships.
                </p>

                <div className="mt-7">
                  <a
                    href="#about"
                    className="inline-flex items-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Learn More About Us
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {["E-Commerce", "Wholesale", "Distribution", "Trading"].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-slate-200 bg-white p-7"
                    >
                      <div
                        aria-hidden="true"
                        className="mb-5 h-2 w-10 rounded-full bg-blue-600"
                      />

                      <h3 className="text-base font-bold text-slate-900">
                        {item}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        Reliable business operations focused on quality and
                        value.
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            ABOUT
        ===================================================== */}

        <section id="about" aria-label="About Deepak Khira Enterprises">
          <AboutUs />
        </section>

        {/* ====================================================
            WHY CHOOSE US
        ===================================================== */}

        <section id="why-us" aria-label="Why choose Deepak Khira Enterprises">
          <WhyChooseUs />
        </section>

        {/* ====================================================
            SHOP CTA
        ===================================================== */}

        <section aria-labelledby="shop-cta-heading" className="bg-slate-950">
          <div className="mx-auto max-w-7xl px-6 py-20 text-center sm:px-8 lg:px-12">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400">
              Discover Our Collection
            </p>

            <h2
              id="shop-cta-heading"
              className="mx-auto mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Find products selected for quality, value and everyday use.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              Explore our complete product catalogue and discover what is
              currently available.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/products"
                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Shop All Products
              </Link>

              <Link
                href="/contact"
                className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold text-white transition hover:border-slate-500 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        {/* ====================================================
            NEWSLETTER
        ===================================================== */}

        <section aria-label="Newsletter">
          <NewsletterForm />
        </section>

        {/* ====================================================
            WHATSAPP SUPPORT
        ===================================================== */}

        <WhatsAppButton />
      </main>
    </>
  );
}
