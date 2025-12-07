"use client";

import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  title: string;
  price: number | string;
  slug: string;
  image?: string;
}

export default function ProductCard({
  title,
  price,
  slug,
  image,
}: ProductCardProps) {
  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg transform transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl">
      {/* Image Section */}
      {image && (
        <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-64">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover rounded-t-2xl transition-transform duration-500 group-hover:scale-105"
            placeholder="blur"
            blurDataURL="/images/placeholder.webp" // tiny placeholder image
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl"></div>
        </div>
      )}

      {/* Product Info */}
      <div className="p-6 text-center flex flex-col justify-between h-40 sm:h-48 md:h-44">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 truncate">
          {title}
        </h3>
        <p className="text-indigo-600 dark:text-indigo-400 font-bold text-lg sm:text-xl mb-4">
          ₹{Number(price).toLocaleString("en-IN")}
        </p>
        <Link
          href={`/products/${slug}`}
          className="mt-auto inline-block px-6 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl font-medium text-sm sm:text-base hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all transform hover:-translate-y-1"
        >
          View Product
        </Link>
      </div>
    </div>
  );
}
