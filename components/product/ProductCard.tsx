"use client";

import Link from "next/link";

interface ProductCardProps {
  title: string;
  price: string;
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
    <div className="group relative rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-gray-800 transition-transform transform hover:-translate-y-3 hover:shadow-2xl animate-fade-in">
      {image && (
        <div className="relative overflow-hidden rounded-t-2xl">
          <img
            src={image}
            alt={title}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl"></div>
        </div>
      )}

      <div className="p-6 text-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-blue-600 dark:text-blue-400 font-bold text-lg mb-4">
          {price}
        </p>
        <Link
          href={`/products/${slug}`}
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
        >
          View Product
        </Link>
      </div>

      <style>
        {`
          @keyframes fade-in {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.8s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}
