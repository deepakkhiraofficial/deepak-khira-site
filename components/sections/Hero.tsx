"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ShoppingCart,
  ShieldCheck,
  Truck,
  Sparkles,
} from "lucide-react";

import { useCart } from "@/components/cart/CartContext";

type Product = {
  _id: string;
  name: string;
  slug?: string;
  price: number;
  stock?: number;
  inStock?: boolean;
  images?: string[];
  rating?: number;
  featured?: boolean;
};

export default function Hero() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      try {
        const params = new URLSearchParams();

        params.set("featured", "true");
        params.set("status", "active");
        params.set("limit", "3");
        params.set("page", "1");
        params.set("sort", "-popularityScore,-createdAt");

        const response = await fetch(`/api/products?${params.toString()}`, {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data?.success) {
          throw new Error(data?.message || "Unable to load products");
        }

        if (mounted) {
          setProducts(
            Array.isArray(data.products) ? data.products.slice(0, 3) : []
          );
        }
      } catch (error) {
        console.error("HERO PRODUCTS ERROR:", error);

        if (mounted) {
          setProducts([]);
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
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }

    return "/placeholder.png";
  }

  function handleAddToCart(product: Product) {
    if (!product.inStock || Number(product.stock ?? 0) <= 0) {
      return;
    }

    addToCart(product, 1);
  }

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-white">
      {/* Background decoration */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-100/60 blur-3xl" />

        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-slate-100 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* =====================================================
              LEFT
          ====================================================== */}

          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />

              <span className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">
                Deepak Khira Enterprises
              </span>
            </div>

            <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-[1.08] tracking-[-0.04em] text-slate-950 sm:text-5xl md:text-6xl">
              Quality products.
              <span className="block text-blue-600">Trusted shopping.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Discover carefully selected products with secure packaging,
              reliable delivery and a customer-first shopping experience.
            </p>

            {/* CTA */}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                Shop Products
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Contact Us
              </Link>
            </div>

            {/* Trust */}

            <div className="mt-10 grid max-w-xl grid-cols-1 gap-4 border-t border-slate-200 pt-7 sm:grid-cols-3">
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Secure Shopping
                  </p>

                  <p className="mt-1 text-xs text-slate-500">Safe checkout</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Truck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Reliable Delivery
                  </p>

                  <p className="mt-1 text-xs text-slate-500">Across India</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Quality Focused
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Selected products
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              RIGHT — REAL PRODUCTS
          ====================================================== */}

          <div className="lg:col-span-6">
            <div className="relative">
              {/* Header */}

              <div className="mb-5 flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
                    Featured Collection
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-950 sm:text-2xl">
                    Popular right now
                  </h2>
                </div>

                <Link
                  href="/products"
                  className="hidden items-center gap-1 text-sm font-semibold text-slate-700 hover:text-blue-600 sm:flex"
                >
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Loading */}

              {loading && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {Array.from({
                    length: 3,
                  }).map((_, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                    >
                      <div className="aspect-square animate-pulse bg-slate-100" />

                      <div className="space-y-2 p-3">
                        <div className="h-4 animate-pulse rounded bg-slate-100" />
                        <div className="h-5 w-1/2 animate-pulse rounded bg-slate-100" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Products */}

              {!loading && products.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {products.map((product) => {
                    const available =
                      product.inStock !== false &&
                      Number(product.stock ?? 0) > 0;

                    const image = getImage(product);

                    return (
                      <article
                        key={product._id}
                        className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                      >
                        {/* Image */}

                        <Link
                          href={`/products/${product.slug || product._id}`}
                          className="relative block aspect-square overflow-hidden bg-slate-100"
                        >
                          <Image
                            src={image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 45vw, 200px"
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />

                          <span className="absolute left-2 top-2 rounded-full bg-slate-950 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-white">
                            Featured
                          </span>

                          {!available && (
                            <span className="absolute right-2 top-2 rounded-full bg-white px-2 py-1 text-[9px] font-bold text-red-600 shadow">
                              Sold Out
                            </span>
                          )}
                        </Link>

                        {/* Content */}

                        <div className="p-3">
                          <Link
                            href={`/products/${product.slug || product._id}`}
                          >
                            <h3 className="line-clamp-2 min-h-[36px] text-xs font-semibold leading-5 text-slate-900 transition group-hover:text-blue-600 sm:text-sm">
                              {product.name}
                            </h3>
                          </Link>

                          <div className="mt-2 flex items-center justify-between gap-2">
                            <span className="text-base font-bold text-slate-950">
                              ₹{Number(product.price).toLocaleString("en-IN")}
                            </span>

                            {product.rating && product.rating > 0 && (
                              <span className="text-[10px] text-slate-500">
                                ★ {product.rating.toFixed(1)}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            disabled={!available}
                            onClick={() => handleAddToCart(product)}
                            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-2 py-2.5 text-[11px] font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 sm:text-xs"
                          >
                            <ShoppingCart className="h-3.5 w-3.5" />

                            {available ? "Add to Cart" : "Out of Stock"}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

              {/* Empty */}

              {!loading && products.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
                  <p className="text-sm font-semibold text-slate-800">
                    Featured products coming soon
                  </p>

                  <Link
                    href="/products"
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-600"
                  >
                    Browse all products
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}

              {/* Mobile view all */}

              <div className="mt-5 sm:hidden">
                <Link
                  href="/products"
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 py-3 text-sm font-semibold text-slate-800"
                >
                  View all products
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
