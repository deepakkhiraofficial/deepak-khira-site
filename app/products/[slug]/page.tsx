"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ProductPageProps {
  params?: {
    slug?: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const slug = params?.slug ?? "unknown-product";
  const [imgSrc, setImgSrc] = useState(`/images/products/${slug}.webp`);

  return (
    <section className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-6">
        {slug.replace(/-/g, " ") || "Unknown Product"}
      </h1>

      <div className="w-full max-w-md mx-auto">
        <Image
          src={imgSrc}
          alt={slug}
          width={500}
          height={500}
          className="rounded-lg shadow-md"
          onError={() => setImgSrc("/images/products/placeholder.webp")}
          priority
        />
      </div>

      <p className="mt-6 text-gray-700 dark:text-gray-300 text-lg text-center">
        {slug !== "unknown-product"
          ? `Detailed information about ${slug.replace(/-/g, " ")} will be available soon.`
          : "Product information is not available."}
      </p>
    </section>
  );
}
