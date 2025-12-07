"use client";

import ProductCard from "./ProductCard";

const products = [
  {
    title: "Enterprise Web App",
    price: "$1999",
    slug: "enterprise-web-app",
    image: "/images/product1.jpg",
  },
  {
    title: "Mobile App Pro",
    price: "$1499",
    slug: "mobile-app-pro",
    image: "/images/product2.jpg",
  },
  {
    title: "UI/UX Package",
    price: "$999",
    slug: "ui-ux-package",
    image: "/images/product3.jpg",
  },
];

export default function ProductList() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 md:px-16">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-12 animate-fade-in">
          Our Products
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {products.map((product, index) => (
            <div
              key={product.slug}
              className="transform transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>

      {/* Tailwind animations */}
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
    </section>
  );
}
