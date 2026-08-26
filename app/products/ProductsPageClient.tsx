"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Filter,
  Search,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Star,
  Package,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

import type { Product } from "@/components/cart/CartContext";
import { useCart } from "@/components/cart/CartContext";

// ============================================================
// TYPES
// ============================================================

interface ProductsResponse {
  success: boolean;
  products: Product[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  totalPages?: number;
  message?: string;
}

interface CategoryObject {
  name?: unknown;
}

// ============================================================
// CONSTANTS
// ============================================================

const API_URL = "/api/products";

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 2000;

const PAGE_LIMIT = 12;

// ============================================================
// HELPERS
// ============================================================

function getProductImage(product: Product): string {
  if (
    Array.isArray(product.images) &&
    product.images.length > 0 &&
    typeof product.images[0] === "string" &&
    product.images[0].trim()
  ) {
    return product.images[0];
  }

  return "/placeholder-product.png";
}

function getSafePrice(price: number | null | undefined): number {
  const value = Number(price);

  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function getSafeStock(stock: number | null | undefined): number {
  const value = Number(stock);

  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function getSafeRating(rating: number | null | undefined): number {
  const value = Number(rating);

  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(5, value));
}

// ============================================================
// COMPONENT
// ============================================================

export default function ProductsPageClient() {
  const searchParams = useSearchParams();

  const { addToCart } = useCart();

  // ==========================================================
  // URL STATE
  // ==========================================================

  const initialSearch = searchParams.get("search") || "";

  const initialCategory = searchParams.get("category") || "";

  const initialSort = searchParams.get("sort") || "-createdAt";

  const initialPage = Math.max(1, Number(searchParams.get("page") || 1) || 1);

  // ==========================================================
  // STATE
  // ==========================================================

  const [products, setProducts] = useState<Product[]>([]);

  const [categories, setCategories] = useState<string[]>([]);

  const [search, setSearch] = useState(initialSearch);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const [sort, setSort] = useState(initialSort);

  const [page, setPage] = useState(initialPage);

  const [minPrice, setMinPrice] = useState(DEFAULT_MIN_PRICE);

  const [maxPrice, setMaxPrice] = useState(DEFAULT_MAX_PRICE);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [total, setTotal] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [addingProductId, setAddingProductId] = useState<string | null>(null);

  // ==========================================================
  // FETCH CATEGORIES
  // ==========================================================

  useEffect(() => {
    let cancelled = false;

    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const data: unknown = await response.json();

        if (cancelled) {
          return;
        }

        const categoryList: unknown[] = Array.isArray(data)
          ? data
          : data &&
              typeof data === "object" &&
              "categories" in data &&
              Array.isArray((data as { categories?: unknown }).categories)
            ? (data as { categories: unknown[] }).categories
            : [];

        const normalized: string[] = categoryList
          .map((item: unknown): string => {
            if (typeof item === "string") {
              return item;
            }

            if (item && typeof item === "object" && "name" in item) {
              return String((item as CategoryObject).name || "");
            }

            return "";
          })
          .map((item: string): string => item.trim())
          .filter((item: string): boolean => Boolean(item));

        setCategories(Array.from(new Set(normalized)));
      } catch (error) {
        console.error("CATEGORY FETCH ERROR:", error);
      }
    };

    fetchCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  // ==========================================================
  // FETCH PRODUCTS
  // ==========================================================

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      params.set("page", String(page));

      params.set("limit", String(PAGE_LIMIT));

      params.set("sort", sort || "-createdAt");

      params.set("minPrice", String(minPrice));

      params.set("maxPrice", String(maxPrice));

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (selectedCategory.trim()) {
        params.set("category", selectedCategory.trim());
      }

      const response = await fetch(`${API_URL}?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      const data: ProductsResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load products.");
      }

      setProducts(Array.isArray(data.products) ? data.products : []);

      setTotal(data.pagination?.total || 0);

      setTotalPages(data.pagination?.totalPages || data.totalPages || 0);
    } catch (error) {
      console.error("PRODUCT FETCH ERROR:", error);

      setProducts([]);

      setTotal(0);

      setTotalPages(0);

      setError("Unable to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, sort, minPrice, maxPrice, search, selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ==========================================================
  // URL SYNC
  // ==========================================================

  useEffect(() => {
    const urlParams = new URLSearchParams();

    if (search.trim()) {
      urlParams.set("search", search.trim());
    }

    if (selectedCategory.trim()) {
      urlParams.set("category", selectedCategory.trim());
    }

    if (sort && sort !== "-createdAt") {
      urlParams.set("sort", sort);
    }

    if (page > 1) {
      urlParams.set("page", String(page));
    }

    const query = urlParams.toString();

    const newUrl = query ? `/products?${query}` : "/products";

    window.history.replaceState(null, "", newUrl);
  }, [search, selectedCategory, sort, page]);

  // ==========================================================
  // RESET PAGE WHEN FILTER CHANGES
  // ==========================================================

  const changeSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const changeCategory = (value: string) => {
    setSelectedCategory(value);
    setPage(1);
    setMobileFiltersOpen(false);
  };

  const changeSort = (value: string) => {
    setSort(value);
    setPage(1);
  };

  // ==========================================================
  // RESET FILTERS
  // ==========================================================

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSort("-createdAt");
    setMinPrice(DEFAULT_MIN_PRICE);
    setMaxPrice(DEFAULT_MAX_PRICE);
    setPage(1);
    setMobileFiltersOpen(false);
  };

  // ==========================================================
  // ADD TO CART
  // ==========================================================

  const handleAddToCart = (product: Product) => {
    if (!product || !product._id || !product.name || !product.slug) {
      console.error("INVALID PRODUCT:", product);

      toast.error("Unable to add this product to cart.");

      return;
    }

    const productStock = getSafeStock(product.stock);

    if (
      product.status !== "active" ||
      product.inStock !== true ||
      productStock <= 0
    ) {
      toast.error("Product is currently out of stock.");

      return;
    }

    try {
      setAddingProductId(product._id);

      addToCart(product, 1);

      toast.success(`${product.name} added to cart`);
    } catch (error) {
      console.error("ADD TO CART ERROR:", error);

      toast.error("Unable to add product to cart.");
    } finally {
      setAddingProductId(null);
    }
  };

  // ==========================================================
  // ACTIVE FILTER COUNT
  // ==========================================================

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (search.trim()) {
      count++;
    }

    if (selectedCategory.trim()) {
      count++;
    }

    if (minPrice !== DEFAULT_MIN_PRICE || maxPrice !== DEFAULT_MAX_PRICE) {
      count++;
    }

    if (sort !== "-createdAt") {
      count++;
    }

    return count;
  }, [search, selectedCategory, minPrice, maxPrice, sort]);

  // ==========================================================
  // LOADING SKELETON
  // ==========================================================

  if (loading && products.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-10 w-64 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />

            <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="h-64 animate-pulse bg-slate-200 dark:bg-slate-800" />

                <div className="space-y-3 p-5">
                  <div className="h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

                  <div className="h-6 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

                  <div className="h-8 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* ======================================================
          HERO / HEADER
      ======================================================= */}

      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Deepak Khira Enterprises
              </p>

              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Our Products
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
                Explore our collection of quality products with reliable
                delivery across India.
              </p>
            </div>

            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {total.toLocaleString("en-IN")}{" "}
              {total === 1 ? "product" : "products"}
            </div>
          </div>

          {/* SEARCH */}

          <div className="mt-7 flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={19}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => changeSearch(event.target.value)}
                placeholder="Search products..."
                aria-label="Search products"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-950"
              />
            </div>

            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 md:hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <SlidersHorizontal size={18} />
              Filters
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================
          CONTENT
      ======================================================= */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
          {/* ==================================================
              DESKTOP FILTERS
          =================================================== */}

          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-blue-600" />

                  <h2 className="font-bold text-slate-900 dark:text-white">
                    Filters
                  </h2>
                </div>

                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* CATEGORY */}

              <div>
                <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">
                  Category
                </h3>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => changeCategory("")}
                    className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                      selectedCategory === ""
                        ? "bg-blue-50 font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                        : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    All Categories
                  </button>

                  {categories.map((category: string) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => changeCategory(category)}
                      className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                        selectedCategory === category
                          ? "bg-blue-50 font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                          : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* PRICE */}

              <div className="mt-7 border-t border-slate-200 pt-6 dark:border-slate-800">
                <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">
                  Price Range
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min={0}
                    value={minPrice}
                    onChange={(event) => {
                      setMinPrice(Math.max(0, Number(event.target.value) || 0));

                      setPage(1);
                    }}
                    placeholder="Min"
                    aria-label="Minimum price"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />

                  <input
                    type="number"
                    min={0}
                    value={maxPrice}
                    onChange={(event) => {
                      setMaxPrice(Math.max(0, Number(event.target.value) || 0));

                      setPage(1);
                    }}
                    placeholder="Max"
                    aria-label="Maximum price"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* SORT */}

              <div className="mt-7 border-t border-slate-200 pt-6 dark:border-slate-800">
                <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">
                  Sort By
                </h3>

                <select
                  value={sort}
                  onChange={(event) => changeSort(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="-createdAt">Newest</option>

                  <option value="price">Price: Low to High</option>

                  <option value="-price">Price: High to Low</option>

                  <option value="-rating">Top Rated</option>

                  <option value="-popularityScore">Most Popular</option>

                  <option value="name">Name: A-Z</option>
                </select>
              </div>
            </div>
          </aside>

          {/* ==================================================
              PRODUCT AREA
          =================================================== */}

          <div>
            {/* TOP BAR */}

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {loading
                  ? "Loading products..."
                  : `Showing ${products.length} of ${total}`}
              </div>

              <div className="flex items-center gap-2 lg:hidden">
                <SlidersHorizontal size={17} className="text-slate-500" />

                <select
                  value={sort}
                  onChange={(event) => changeSort(event.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  aria-label="Sort products"
                >
                  <option value="-createdAt">Newest</option>

                  <option value="price">Price: Low to High</option>

                  <option value="-price">Price: High to Low</option>

                  <option value="-rating">Top Rated</option>

                  <option value="-popularityScore">Most Popular</option>
                </select>
              </div>
            </div>

            {/* ERROR */}

            {error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900/50 dark:bg-red-950/30">
                <p className="font-semibold text-red-700 dark:text-red-400">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={fetchProducts}
                  className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* EMPTY */}

            {!loading && !error && products.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900">
                <Package size={42} className="mx-auto text-slate-400" />

                <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                  No products found
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                  Try changing your search, category or price filters.
                </p>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* PRODUCTS */}

            {products.length > 0 && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product: Product) => {
                  const productImage = getProductImage(product);

                  const productPrice = getSafePrice(product.price);

                  const productStock = getSafeStock(product.stock);

                  const productRating = getSafeRating(product.rating);

                  const isAvailable =
                    product.status === "active" &&
                    product.inStock === true &&
                    productStock > 0;

                  return (
                    <article
                      key={product._id}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                    >
                      {/* IMAGE */}

                      <Link
                        href={`/products/${product.slug}`}
                        className="relative block overflow-hidden bg-slate-100 dark:bg-slate-800"
                      >
                        <div className="relative h-64 w-full">
                          <Image
                            src={productImage}
                            alt={`${product.name} - ${product.category}`}
                            fill
                            sizes="(max-inline-size: 640px) 100vw, (max-inline-size: 1280px) 33vw, 25vw"
                            className="object-contain p-5 transition duration-500 group-hover:scale-105"
                          />
                        </div>

                        {product.featured && (
                          <span className="absolute left-3 top-3 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow">
                            Featured
                          </span>
                        )}

                        {!isAvailable && (
                          <span className="absolute right-3 top-3 rounded-full bg-red-600 px-3 py-1 text-[11px] font-bold text-white shadow">
                            Out of Stock
                          </span>
                        )}
                      </Link>

                      {/* INFO */}

                      <div className="flex flex-1 flex-col p-5">
                        <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                          {product.category}
                        </p>

                        <h2 className="mt-2 line-clamp-2 min-h-[48px] text-lg font-bold leading-6 text-slate-900 dark:text-white">
                          {product.name}
                        </h2>

                        {/* RATING */}

                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex">
                            {Array.from({
                              length: 5,
                            }).map((_, index: number) => (
                              <Star
                                key={index}
                                size={14}
                                className={
                                  index < Math.round(productRating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-slate-300 dark:text-slate-600"
                                }
                              />
                            ))}
                          </div>

                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {productRating > 0
                              ? productRating.toFixed(1)
                              : "New"}
                          </span>
                        </div>

                        {/* PRICE */}

                        <div className="mt-4">
                          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                            ₹{productPrice.toLocaleString("en-IN")}
                          </span>
                        </div>

                        {/* STOCK */}

                        <p className="mt-2 text-xs font-medium">
                          {isAvailable ? (
                            <span className="text-emerald-600 dark:text-emerald-400">
                              In Stock
                            </span>
                          ) : (
                            <span className="text-red-600 dark:text-red-400">
                              Currently unavailable
                            </span>
                          )}
                        </p>

                        {/* ACTIONS */}

                        <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
                          <Link
                            href={`/products/${product.slug}`}
                            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
                          >
                            View Details
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleAddToCart(product)}
                            disabled={
                              !isAvailable || addingProductId === product._id
                            }
                            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <ShoppingCart size={16} />

                            {addingProductId === product._id
                              ? "Adding..."
                              : "Add"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* ==================================================
                PAGINATION
            =================================================== */}

            {totalPages > 1 && (
              <nav
                className="mt-10 flex items-center justify-center gap-2"
                aria-label="Product pagination"
              >
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page <= 1 || loading}
                  aria-label="Previous page"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                >
                  <ChevronLeft size={18} />
                </button>

                <span className="min-w-24 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Page {page} of {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
                  disabled={page >= totalPages || loading}
                  aria-label="Next page"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                >
                  <ChevronRight size={18} />
                </button>
              </nav>
            )}
          </div>
        </div>
      </section>

      {/* ======================================================
          MOBILE FILTER DRAWER
      ======================================================= */}

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-black/50"
          />

          <aside className="absolute right-0 top-0 h-full w-[min(360px,90%)] overflow-y-auto bg-white p-6 shadow-2xl dark:bg-slate-900">
            <div className="mb-7 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter size={19} className="text-blue-600" />

                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Filters
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* CATEGORY */}

            <div>
              <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">
                Category
              </h3>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => changeCategory("")}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                    selectedCategory === ""
                      ? "bg-blue-50 font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  All Categories
                </button>

                {categories.map((category: string) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => changeCategory(category)}
                    className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                      selectedCategory === category
                        ? "bg-blue-50 font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                        : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* PRICE */}

            <div className="mt-7 border-t border-slate-200 pt-6 dark:border-slate-800">
              <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">
                Price Range
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min={0}
                  value={minPrice}
                  onChange={(event) => {
                    setMinPrice(Math.max(0, Number(event.target.value) || 0));

                    setPage(1);
                  }}
                  placeholder="Min"
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />

                <input
                  type="number"
                  min={0}
                  value={maxPrice}
                  onChange={(event) => {
                    setMaxPrice(Math.max(0, Number(event.target.value) || 0));

                    setPage(1);
                  }}
                  placeholder="Max"
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* CLEAR */}

            <button
              type="button"
              onClick={resetFilters}
              className="mt-8 w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900"
            >
              Clear All Filters
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}
