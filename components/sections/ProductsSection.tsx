"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ShoppingCart, Star, PackageOpen } from "lucide-react";

import { useCart } from "@/components/cart/CartContext";

type Product = {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  category?: string;
  price: number;
  stock?: number;
  inStock?: boolean;
  images?: string[];
  featured?: boolean;
  status?: string;
  rating?: number;
};

type ProductsResponse = {
  success?: boolean;
  products?: Product[];
  pagination?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
};

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { addToCart } = useCart();

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        params.set("page", "1");
        params.set("limit", "8");
        params.set("status", "active");

        // Latest products first
        params.set("sort", "-createdAt");

        const response = await fetch(`/api/products?${params.toString()}`, {
          method: "GET",
          cache: "no-store",
        });

        const data: ProductsResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error("Unable to load products.");
        }

        if (mounted) {
          setProducts(Array.isArray(data.products) ? data.products : []);
        }
      } catch (error) {
        console.error("PRODUCTS SECTION ERROR:", error);

        if (mounted) {
          setError("Unable to load products right now.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  function getImage(product: Product) {
    if (
      Array.isArray(product.images) &&
      product.images.length > 0 &&
      product.images[0]
    ) {
      return product.images[0];
    }

    return "/placeholder.png";
  }

  function isAvailable(product: Product) {
    return (
      product.status === "active" &&
      product.inStock !== false &&
      Number(product.stock ?? 0) > 0
    );
  }

  function handleAddToCart(product: Product) {
    if (!isAvailable(product)) {
      return;
    }

    addToCart(product, 1);
  }

  return (
    <section id="latest-products" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5">
              <PackageOpen className="h-3.5 w-3.5 text-blue-600" />

              <span className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
                New Arrivals
              </span>
            </div>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Latest Products
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Explore our latest products selected for quality, value and
              everyday use.
            </p>
          </div>

          <Link
            href="/products"
            className="group inline-flex w-fit items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-blue-600 hover:text-blue-600"
          >
            View All Products
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* =====================================================
            LOADING
        ====================================================== */}

        {loading && (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({
              length: 8,
            }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="aspect-square animate-pulse bg-slate-100" />

                <div className="space-y-3 p-4">
                  <div className="h-3 w-1/3 animate-pulse rounded bg-slate-100" />

                  <div className="h-4 animate-pulse rounded bg-slate-100" />

                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />

                  <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =====================================================
            ERROR
        ====================================================== */}

        {!loading && error && (
          <div className="mt-10 rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
            <p className="font-semibold text-red-800">Products unavailable</p>

            <p className="mt-1 text-sm text-red-600">{error}</p>

            <Link
              href="/products"
              className="mt-4 inline-flex rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Open Products
            </Link>
          </div>
        )}

        {/* =====================================================
            PRODUCTS
        ====================================================== */}

        {!loading && !error && products.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => {
              const available = isAvailable(product);

              const image = getImage(product);

              const rating = Number(product.rating ?? 0);

              return (
                <article
                  key={product._id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
                >
                  {/* =================================================
                          IMAGE
                      ================================================== */}

                  <Link
                    href={`/products/${product.slug || product._id}`}
                    className="relative block aspect-square overflow-hidden bg-slate-100"
                  >
                    <Image
                      src={image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />

                    {/* New badge */}

                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-800 shadow-sm backdrop-blur">
                      New
                    </span>

                    {/* Stock */}

                    {!available && (
                      <span className="absolute right-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold text-white">
                        Out of Stock
                      </span>
                    )}

                    {/* Featured */}

                    {product.featured && (
                      <span className="absolute bottom-3 left-3 rounded-full bg-slate-950/90 px-2.5 py-1 text-[10px] font-bold text-white">
                        Featured
                      </span>
                    )}
                  </Link>

                  {/* =================================================
                          CONTENT
                      ================================================== */}

                  <div className="flex flex-1 flex-col p-4">
                    {/* Category */}

                    {product.category && (
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-600">
                        {product.category}
                      </p>
                    )}

                    {/* Name */}

                    <Link
                      href={`/products/${product.slug || product._id}`}
                      className="mt-1"
                    >
                      <h3 className="line-clamp-2 min-h-[40px] text-sm font-semibold leading-5 text-slate-900 transition group-hover:text-blue-600 sm:text-base">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating */}

                    <div className="mt-2 flex min-h-[18px] items-center gap-1">
                      {rating > 0 ? (
                        <>
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />

                          <span className="text-xs font-semibold text-slate-700">
                            {rating.toFixed(1)}
                          </span>
                        </>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          No ratings yet
                        </span>
                      )}
                    </div>

                    {/* Price */}

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <p className="text-lg font-bold text-slate-950">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </p>

                      {available && Number(product.stock) <= 10 && (
                        <span className="text-[10px] font-semibold text-orange-600">
                          Only {product.stock} left
                        </span>
                      )}
                    </div>

                    {/* Add to cart */}

                    <button
                      type="button"
                      disabled={!available}
                      onClick={() => handleAddToCart(product)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 sm:text-sm"
                    >
                      <ShoppingCart className="h-4 w-4" />

                      {available ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* =====================================================
            EMPTY
        ====================================================== */}

        {!loading && !error && products.length === 0 && (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-14 text-center">
            <PackageOpen className="mx-auto h-10 w-10 text-slate-400" />

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              No products available
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              We are currently updating our product collection. Please check
              back soon.
            </p>

            <Link
              href="/products"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-600"
            >
              Browse Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* =====================================================
            BOTTOM CTA
        ====================================================== */}

        {!loading && !error && products.length > 0 && (
          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl bg-slate-950 px-6 py-6 sm:flex-row sm:px-8">
            <div>
              <p className="text-sm font-bold text-white">
                Looking for something specific?
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Browse our complete product collection.
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-blue-50"
            >
              Explore All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
