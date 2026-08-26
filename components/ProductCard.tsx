"use client";

import Link from "next/link";
import Image from "next/image";

interface Product {
  name: string;
  slug: string;
  images: string[];
  price: number;
  discount?: number; // optional
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Calculate discounted price if available
  const finalPrice = product.discount
    ? product.price - product.price * (product.discount / 100)
    : product.price;

  return (
    <Link href={`/products/${product.slug}`} className="block group" prefetch>
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="relative w-full h-64 md:h-72 lg:h-80">
          <Image
            src={product.images[0] || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            priority
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 truncate">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-blue-600 font-bold text-lg">
              ₹{finalPrice.toLocaleString("en-IN")}
            </span>
            {product.discount && (
              <span className="text-gray-400 line-through text-sm">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
