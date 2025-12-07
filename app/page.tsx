// "use client";

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import AboutUs from "@/components/sections/AboutUs";
import Products from "@/app/products/page";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import WhatsAppButton from "@/components/sections/WhatsAppButton";
import NewsletterForm from "@/components/sections/NewsletterForm";
import Script from "next/script";

// -------------------- SEO METADATA --------------------
export const metadata = {
  title:
    "Deepak Khira Enterprises – Trusted Online Seller in India | Fast Delivery & Genuine Products",
  description:
    "Deepak Khira Enterprises is a reliable and verified online seller delivering high-quality products across India with fast delivery, secure packaging, and excellent customer support.",
  keywords: [
    "Deepak Khira Enterprises",
    "online seller India",
    "trusted seller India",
    "best products online India",
    "fast delivery Madhya Pradesh",
    "affordable online products",
    "secure packaging seller",
    "online shopping India",
  ],
  authors: [{ name: "Deepak Khira" }],
  creator: "Deepak Khira Enterprises",
  openGraph: {
    title:
      "Deepak Khira Enterprises – Best Trusted Online Seller in India | Quality Products",
    description:
      "A trusted online seller offering high-quality products with fast shipping and 100% customer satisfaction.",
    url: "https://instagram.com/deepakkhiraofficial/",
    siteName: "Deepak Khira Enterprises",
    images: [
      {
        url: "/business_logo.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deepak Khira Enterprises – Trusted Online Seller",
    description:
      "Premium online seller providing top-quality products with reliable delivery across India.",
    images: ["/business_logo.png"],
  },
  alternates: {
    canonical: "https://twitter.com/deepakkhira/",
  },
};

// -------------------- PAGE COMPONENT --------------------
export default function Home() {
  return (
    <>
      <Navbar />

      {/* ---------- ORGANIZATION SCHEMA ---------- */}
      <Script
        id="org-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Deepak Khira Enterprises",
            url: "https://deepakkhiraenterprises.netlify.app",
            logo: "/business_logo.png",
            description:
              "Deepak Khira Enterprises is a trusted online seller delivering premium products across India.",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+91-9109001109",
              contactType: "Customer Support",
            },
          }),
        }}
      />

      {/* ---------- LOCAL BUSINESS SCHEMA ---------- */}
      <Script
        id="local-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Deepak Khira Enterprises",
            image: "/business_logo.png",
            telephone: "+91-9109001109",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Dabra",
              addressLocality: "Gwalior",
              addressRegion: "Madhya Pradesh",
              postalCode: "475110",
              addressCountry: "IN",
            },
          }),
        }}
      />

      <main className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-all">
        <Hero />
        <AboutUs />
        <Products />
        <WhyChooseUs />
        <NewsletterForm />
        <WhatsAppButton />
      </main>
    </>
  );
}
