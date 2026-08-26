// app/products/page.tsx
"use client";
import SEO from "@/components/SEO";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCart } from "@/components/cart/CartContext";

type Product = {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  category?: string;
  price?: number;
  images?: string[];
  rating?: number;
  stock?: number;
  inStock?: boolean;
  featured?: boolean;
};

const DEFAULT_LIMIT = 12;
const DEFAULT_MIN = 0;
const DEFAULT_MAX = 20000;

export default function ProductsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // data
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // UI state (filters)
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [rangeMin, setRangeMin] = useState<number>(DEFAULT_MIN);
  const [rangeMax, setRangeMax] = useState<number>(2000);
  const [minRating, setMinRating] = useState<number | "">("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sort, setSort] = useState<string>("-createdAt");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(DEFAULT_LIMIT);

  const { addToCart } = useCart();

  // refs and helpers
  const abortRef = useRef<AbortController | null>(null);
  const skipInitRef = useRef(true); // skip URL updates on initial mount

  // ---------- init: read URL (once) ----------
  useEffect(() => {
    if (!searchParams) return;

    const s = searchParams.get("search") ?? "";
    const cats = searchParams.get("categories") ?? "";
    const minP = searchParams.get("minPrice") ?? "";
    const maxP = searchParams.get("maxPrice") ?? "";
    const rmin = searchParams.get("rangeMin") ?? "";
    const rmax = searchParams.get("rangeMax") ?? "";
    const minR = searchParams.get("minRating") ?? "";
    const instock = searchParams.get("inStock") ?? "";
    const featured = searchParams.get("featured") ?? "";
    const sortParam = searchParams.get("sort") ?? "-createdAt";
    const pageParam = Number(searchParams.get("page") ?? "1");
    const rangeMinParam = Number(rmin || DEFAULT_MIN);
    const rangeMaxParam = Number(rmax || 2000);

    setSearch(s);
    setDebouncedSearch(s);
    setSelectedCategories(cats ? cats.split(",").filter(Boolean) : []);
    setMinPrice(minP === "" ? "" : Number(minP));
    setMaxPrice(maxP === "" ? "" : Number(maxP));
    setRangeMin(Number.isNaN(rangeMinParam) ? DEFAULT_MIN : rangeMinParam);
    setRangeMax(Number.isNaN(rangeMaxParam) ? 2000 : rangeMaxParam);
    setMinRating(minR === "" ? "" : Number(minR));
    setInStockOnly(instock === "true");
    setFeaturedOnly(featured === "true");
    setSort(sortParam);
    setPage(Math.max(1, pageParam));

    // done init
    skipInitRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- fetch categories ----------
  useEffect(() => {
    let mounted = true;
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => {
        if (!mounted) return;
        if (d?.success && Array.isArray(d.categories))
          setCategories(d.categories);
        else if (d?.success && Array.isArray(d.categories?.map))
          setCategories(d.categories); // fallback
      })
      .catch((e) => console.error("Failed load categories", e));
    return () => {
      mounted = false;
    };
  }, []);

  // ---------- debounce search ----------
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 450);
    return () => clearTimeout(t);
  }, [search]);

  // ---------- build query ----------
  const buildQuery = useCallback(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (selectedCategories.length)
      params.set("categories", selectedCategories.join(","));
    if (minPrice !== "") params.set("minPrice", String(minPrice));
    if (maxPrice !== "") params.set("maxPrice", String(maxPrice));
    // include slider range if present (for UI bookmarking)
    params.set("rangeMin", String(rangeMin));
    params.set("rangeMax", String(rangeMax));
    if (minRating !== "") params.set("minRating", String(minRating));
    if (inStockOnly) params.set("inStock", "true");
    if (featuredOnly) params.set("featured", "true");
    if (sort) params.set("sort", sort);
    params.set("page", String(page));
    params.set("limit", String(limit));
    return params.toString();
  }, [
    debouncedSearch,
    selectedCategories,
    minPrice,
    maxPrice,
    rangeMin,
    rangeMax,
    minRating,
    inStockOnly,
    featuredOnly,
    sort,
    page,
    limit,
  ]);

  // ---------- update URL when filters change (skip first init) ----------
  useEffect(() => {
    if (skipInitRef.current) return;
    const qs = buildQuery();
    const url = qs ? `${pathname}?${qs}` : pathname;
    router.replace(url);
  }, [buildQuery, pathname, router]);

  // ---------- fetch products ----------
  const fetchProducts = useCallback(async () => {
    try {
      if (abortRef.current) abortRef.current.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      setLoading(true);
      const qs = buildQuery();
      const res = await fetch(`/api/products?${qs}`, { signal: ctrl.signal });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        toast.error("Failed to load products");
        console.error("Products fetch error:", res.status, text);
        return;
      }
      const data = await res.json();
      setProducts(data.products ?? []);
      setTotalPages(data.totalPages ?? 1);
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        console.error(err);
        toast.error("Network error");
      }
    } finally {
      setLoading(false);
    }
  }, [buildQuery]);

  useEffect(() => {
    fetchProducts();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchProducts]);

  // ---------- UI helpers ----------
  const toggleCategory = (c: string) => {
    setPage(1);
    setSelectedCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
    setRangeMin(DEFAULT_MIN);
    setRangeMax(2000);
    setMinRating("");
    setInStockOnly(false);
    setFeaturedOnly(false);
    setSort("-createdAt");
    setPage(1);
    setSearch("");
  };

  const handleAddToCart = (p: Product) => {
    if (!p?._id) {
      toast.error("Invalid product");
      return;
    }
  
    addToCart(p, 1);
  };

  // quick price buttons
  const applyQuickRange = (min: number, max: number) => {
    setMinPrice(min === 0 ? "" : min);
    setMaxPrice(max === 0 ? "" : max);
    setRangeMin(min);
    setRangeMax(max);
    setPage(1);
  };

  // skeletons
  const skeleton = useMemo(
    () =>
      [...Array(8)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-md animate-pulse h-72 border"
        />
      )),
    []
  );

  const getImage = (p: Product) => p.images?.[0] || "/placeholder.png";

  // ---------- responsive layout: left sidebar on desktop, top filters on mobile ----------
  return (
    <div className="min-h-screen px-4 md:px-10 lg:px-20 py-10 bg-gray-100">
      <SEO
        title="Our Products – Deepak Khira Enterprises"
        description="Browse high-quality products from Deepak Khira Enterprises with fast delivery across India."
        keywords={["online seller India", "premium products", "fast delivery"]}
        url="https://deepakkhiraenterprises.netlify.app/products"
        image="/products/hero.png"
      />
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
        Explore Products
      </h1>

      {/* SEARCH + top filters on mobile */}
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center gap-3 w-full md:max-w-lg">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full p-3 border rounded-xl shadow-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-white border rounded-xl hover:bg-gray-50"
          >
            Clear
          </button>
        </div>

        {/* mobile-only: filters row */}
        <div className="flex gap-2 md:hidden flex-wrap">
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="p-2 border rounded-md bg-white"
          >
            <option value="-createdAt">Newest</option>
            <option value="createdAt">Oldest</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-popularityScore">Popularity</option>
            <option value="-rating">Top Rated</option>
          </select>

          <select
            value={minRating === "" ? "" : String(minRating)}
            onChange={(e) => {
              setMinRating(e.target.value === "" ? "" : Number(e.target.value));
              setPage(1);
            }}
            className="p-2 border rounded-md bg-white"
          >
            <option value="">Rating</option>
            <option value="4">4+ ⭐</option>
            <option value="3">3+ ⭐</option>
            <option value="2">2+ ⭐</option>
          </select>

          <button
            onClick={() => setInStockOnly((v) => !v)}
            className={`px-3 py-1 rounded-md border ${inStockOnly ? "bg-blue-600 text-white" : "bg-white"}`}
          >
            In stock
          </button>

          <button
            onClick={() => setFeaturedOnly((v) => !v)}
            className={`px-3 py-1 rounded-md border ${featuredOnly ? "bg-blue-600 text-white" : "bg-white"}`}
          >
            Featured
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT SIDEBAR (desktop) */}
        <aside className="hidden lg:block w-72 bg-white rounded-2xl p-4 border">
          <h3 className="font-semibold mb-3">Filters</h3>

          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">Categories</div>
            <div className="flex flex-col gap-2 max-h-56 overflow-auto">
              {categories.length === 0 ? (
                <div className="text-sm text-gray-400">No categories</div>
              ) : (
                categories.map((c) => {
                  const active = selectedCategories.includes(c);
                  return (
                    <label key={c} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => toggleCategory(c)}
                      />
                      <span className={active ? "font-semibold" : "text-sm"}>
                        {c}
                      </span>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">Price range (₹)</div>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(
                    e.target.value === ""
                      ? ""
                      : Math.max(0, Number(e.target.value))
                  );
                  setPage(1);
                }}
                className="w-1/2 p-2 border rounded-md bg-white"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(
                    e.target.value === ""
                      ? ""
                      : Math.max(0, Number(e.target.value))
                  );
                  setPage(1);
                }}
                className="w-1/2 p-2 border rounded-md bg-white"
              />
            </div>

            <div className="text-xs text-gray-500 mb-2">Quick range</div>
            <div className="flex gap-2 flex-wrap mb-3">
              {[0, 250, 500, 1000, 2000].map((val) => (
                <button
                  key={val}
                  onClick={() =>
                    applyQuickRange(
                      val === 0 ? 0 : val,
                      val === 0 ? 0 : val * 2
                    )
                  }
                  className="px-2 py-1 text-sm rounded-md border bg-white"
                >
                  {val === 0 ? "Any" : `₹${val}`}
                </button>
              ))}
            </div>

            <div className="text-xs text-gray-500 mb-2">Slider</div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={DEFAULT_MIN}
                  max={DEFAULT_MAX}
                  value={rangeMin}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (v <= rangeMax) setRangeMin(v);
                    else setRangeMin(rangeMax);
                    setPage(1);
                  }}
                  className="w-full"
                />
                <div className="w-20 text-right text-sm">₹{rangeMin}</div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={DEFAULT_MIN}
                  max={DEFAULT_MAX}
                  value={rangeMax}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (v >= rangeMin) setRangeMax(v);
                    else setRangeMax(rangeMin);
                    setPage(1);
                  }}
                  className="w-full"
                />
                <div className="w-20 text-right text-sm">₹{rangeMax}</div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">Minimum rating</div>
            <select
              value={minRating === "" ? "" : String(minRating)}
              onChange={(e) => {
                setMinRating(
                  e.target.value === "" ? "" : Number(e.target.value)
                );
                setPage(1);
              }}
              className="w-full p-2 border rounded-md bg-white"
            >
              <option value="">Any</option>
              <option value="4">4+ stars</option>
              <option value="3">3+ stars</option>
              <option value="2">2+ stars</option>
            </select>
          </div>

          <div className="mb-4 flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => {
                  setInStockOnly(e.target.checked);
                  setPage(1);
                }}
              />{" "}
              In stock only
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(e) => {
                  setFeaturedOnly(e.target.checked);
                  setPage(1);
                }}
              />{" "}
              Featured only
            </label>
          </div>

          <div className="mt-4">
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="w-full p-2 border rounded-md bg-white mb-3"
            >
              <option value="-createdAt">Newest</option>
              <option value="createdAt">Oldest</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-popularityScore">Popularity</option>
              <option value="-rating">Top Rated</option>
            </select>
            <button
              onClick={clearFilters}
              className="w-full px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Clear all filters
            </button>
          </div>
        </aside>

        {/* RESULTS */}
        <section className="flex-1">
          {/* Active chips */}
          <div className="mb-4 flex flex-wrap gap-2">
            {debouncedSearch ? (
              <div className="flex items-center gap-2 bg-white border rounded-full px-3 py-1 text-sm">
                <span>Search: {debouncedSearch}</span>
                <button
                  onClick={() => setSearch("")}
                  className="text-gray-500 px-1"
                >
                  ×
                </button>
              </div>
            ) : null}

            {selectedCategories.map((c) => (
              <div
                key={c}
                className="flex items-center gap-2 bg-white border rounded-full px-3 py-1 text-sm"
              >
                <span>{c}</span>
                <button
                  onClick={() =>
                    setSelectedCategories((prev) => prev.filter((x) => x !== c))
                  }
                  className="text-gray-500 px-1"
                >
                  ×
                </button>
              </div>
            ))}

            {minPrice !== "" ? (
              <div className="bg-white border rounded-full px-3 py-1 text-sm">
                Min ₹{minPrice}
              </div>
            ) : null}
            {maxPrice !== "" ? (
              <div className="bg-white border rounded-full px-3 py-1 text-sm">
                Max ₹{maxPrice}
              </div>
            ) : null}
            {rangeMin !== DEFAULT_MIN || rangeMax !== 2000 ? (
              <div className="bg-white border rounded-full px-3 py-1 text-sm">
                Range ₹{rangeMin}–₹{rangeMax}
              </div>
            ) : null}
            {minRating !== "" ? (
              <div className="bg-white border rounded-full px-3 py-1 text-sm">
                {minRating}+ ⭐
              </div>
            ) : null}
            {inStockOnly ? (
              <div className="bg-white border rounded-full px-3 py-1 text-sm">
                In stock
              </div>
            ) : null}
            {featuredOnly ? (
              <div className="bg-white border rounded-full px-3 py-1 text-sm">
                Featured
              </div>
            ) : null}
          </div>

          {/* grid */}
          {loading ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {skeleton}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-600 text-lg">
              No products found.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border group overflow-hidden"
                >
                  <div className="h-48 bg-gray-100 overflow-hidden">
                    <Image
                      src={getImage(p)}
                      alt={p.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
                    />
                  </div>

                  <div className="p-4 space-y-2">
                    <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                      {p.name}
                    </h2>
                    <p className="text-gray-500 text-sm line-clamp-2">
                      {p.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-blue-600">
                        ₹{p.price}
                      </p>
                      <p className="text-sm text-gray-600">
                        {p.rating ? `${p.rating.toFixed(1)} ⭐` : "—"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(p)}
                        className="w-full mt-2 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:scale-95 transition"
                      >
                        Add to Cart
                      </button>
                      <a
                        href={`/products/${p.slug || p._id}`}
                        className="mt-2 py-2 px-3 border rounded-xl"
                      >
                        View
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* pagination */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl bg-white border hover:bg-blue-50 disabled:opacity-40"
            >
              Prev
            </button>
            <span className="px-4 py-2 rounded-xl bg-blue-600 text-white">
              {page}
            </span>
            <button
              onClick={() => page < totalPages && setPage((p) => p + 1)}
              disabled={page >= totalPages}
              className="px-4 py-2 rounded-xl bg-white border hover:bg-blue-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
