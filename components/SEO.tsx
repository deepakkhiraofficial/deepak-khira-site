"use client";

import React from "react";

export interface SEOProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  keywords?: string[];
  siteName?: string;
  author?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  schema?: any; // JSON-LD Structured Data
  twitterHandle?: string; // e.g. "@DeepakKhira"
}

export default function SEO({
  title,
  description,
  url,
  image,
  keywords = [],
  siteName = "Deepak Khira Enterprises",
  author = "Deepak Kushwah",
  noIndex = false,
  noFollow = false,
  schema,
  twitterHandle = "@DeepakKhira",
}: SEOProps) {
  const defaultUrl = url || "https://deepakkhiraenterprises.netlify.app";
  const defaultImage = image || "/business_logo.png";
  const robots = `${noIndex ? "noindex" : "index"}, ${noFollow ? "nofollow" : "follow"}`;

  // Default Organization Schema
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: defaultUrl,
    logo: defaultImage,
    sameAs: [
      "https://facebook.com/deepakkhiraofficial",
      "https://instagram.com/deepakkhiraofficial",
      "https://www.linkedin.com/in/mrdeepakkushwah",
      "https://x.com/DeepakKhira",
      "https://www.youtube.com/@deepakkhiraofficial",
      "https://github.com/mrdeepakkushwah",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-9109001109",
      contactType: "Customer Support",
    },
  };

  return (
    <>
      {/* Primary Meta */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(", ")} />
      )}
      <meta name="author" content={author} />
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />

      {/* Canonical URL */}
      <link rel="canonical" href={defaultUrl} />

      {/* OpenGraph Meta */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:url" content={defaultUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:image" content={defaultImage} />
      <meta property="og:image:width" content="800" />
      <meta property="og:image:height" content="600" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={defaultImage} />

      {/* Favicons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <meta name="theme-color" content="#ffffff" />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema || defaultSchema),
        }}
      />
    </>
  );
}
