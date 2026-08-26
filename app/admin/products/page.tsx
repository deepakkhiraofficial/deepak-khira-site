"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  Plus,
  Search,
  Package,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  AlertCircle,
} from "lucide-react";

import { toast } from "react-toastify";

import ProductTable, { ProductType } from "@/components/admin/ProductTable";

import "react-toastify/dist/ReactToastify.css";

const LIMIT = 10;

type ApiResponse = {
  success?: boolean;
  message?: string;
  products?: ProductType[];
  total?: number;
  totalProducts?: number;
  totalPages?: number;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [totalProducts, setTotalProducts] = useState(0);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  // ============================================================
  // FETCH PRODUCTS
  // ============================================================

  const fetchProducts = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const params = new URLSearchParams({
          search: search.trim(),
          page: String(page),
          limit: String(LIMIT),
        });

        const response = await fetch(
          `/api/admin/products?${params.toString()}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        let data: ApiResponse;

        try {
          data = await response.json();
        } catch {
          throw new Error("Invalid server response.");
        }

        if (response.status === 401) {
          throw new Error("Admin session expired. Please login again.");
        }

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load products.");
        }

        const nextProducts = Array.isArray(data.products) ? data.products : [];

        setProducts(nextProducts);

        const pages = Number(data.totalPages) || 1;

        setTotalPages(Math.max(1, pages));

        const total =
          Number(data.total) ||
          Number(data.totalProducts) ||
          nextProducts.length;

        setTotalProducts(total);

        // Safety: API may return fewer pages
        if (page > Math.max(1, pages)) {
          setPage(Math.max(1, pages));
        }
      } catch (error: unknown) {
        console.error("ADMIN PRODUCTS FETCH ERROR:", error);

        const message =
          error instanceof Error ? error.message : "Unable to load products.";

        setError(message);

        toast.error(message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [search, page]
  );

  // ============================================================
  // LOAD PRODUCTS
  // ============================================================

  useEffect(() => {
    const timer = window.setTimeout(
      () => {
        fetchProducts();
      },
      search.trim() ? 350 : 0
    );

    return () => {
      window.clearTimeout(timer);
    };
  }, [fetchProducts, search]);

  // ============================================================
  // SEARCH
  // ============================================================

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);

    if (page !== 1) {
      setPage(1);
    }
  };

  // ============================================================
  // CLEAR SEARCH
  // ============================================================

  const clearSearch = () => {
    setSearch("");
    setPage(1);
  };

  // ============================================================
  // REFRESH
  // ============================================================

  const handleRefresh = () => {
    fetchProducts(true);
  };

  // ============================================================
  // DELETE PRODUCT
  // ============================================================

  const handleDelete = async (id: string) => {
    if (!id) {
      toast.error("Invalid product ID.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?\n\nThis action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      let data: {
        success?: boolean;
        message?: string;
      };

      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid server response.");
      }

      if (response.status === 401) {
        throw new Error("Admin session expired. Please login again.");
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete product.");
      }

      toast.success("Product deleted successfully.");

      const remainingProducts = products.filter(
        (product) => product._id !== id
      );

      setProducts(remainingProducts);

      setTotalProducts((previous) => Math.max(0, previous - 1));

      // If last item of page was deleted
      if (remainingProducts.length === 0 && page > 1) {
        setPage((previous) => previous - 1);

        return;
      }

      // Refresh pagination/data
      await fetchProducts();
    } catch (error: unknown) {
      console.error("DELETE PRODUCT ERROR:", error);

      toast.error(
        error instanceof Error ? error.message : "Unable to delete product."
      );
    }
  };

  // ============================================================
  // EDIT PRODUCT
  // ============================================================

  const handleEdit = (id: string) => {
    if (!id) {
      toast.error("Invalid product ID.");
      return;
    }

    window.location.href = `/admin/products/${id}/edit`;
  };

  // ============================================================
  // PAGINATION
  // ============================================================

  const goToPreviousPage = () => {
    setPage((previous) => Math.max(1, previous - 1));
  };

  const goToNextPage = () => {
    setPage((previous) => Math.min(totalPages, previous + 1));
  };

  // ============================================================
  // PAGE RANGE
  // ============================================================

  const pageInfo = useMemo(() => {
    if (totalProducts <= 0) {
      return {
        from: 0,
        to: 0,
      };
    }

    return {
      from: (page - 1) * LIMIT + 1,

      to: Math.min(page * LIMIT, totalProducts),
    };
  }, [page, totalProducts]);

  // ============================================================
  // ERROR STATE
  // ============================================================

  if (error && !loading) {
    return (
      <div className="space-y-8">
        <div>
          <p className="text-sm font-semibold text-blue-600">Catalog</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Products
          </h1>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="mt-0.5 shrink-0 text-red-600" />

            <div>
              <h2 className="font-semibold text-red-900">
                Unable to load products
              </h2>

              <p className="mt-1 text-sm text-red-700">{error}</p>

              <button
                type="button"
                onClick={() => fetchProducts()}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                <RefreshCw size={15} />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="space-y-7">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Package size={16} />

            <span>Catalog</span>

            <span>/</span>

            <span className="font-medium text-slate-900">Products</span>
          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Products
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Manage your product catalog, inventory and product information.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {/* ======================================================
          SUMMARY
      ====================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Products
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {totalProducts.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Package size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Current Page</p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {products.length}
          </p>

          <p className="mt-1 text-xs text-slate-400">Products displayed</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Catalog Pages</p>

          <p className="mt-2 text-2xl font-bold text-slate-900">{totalPages}</p>

          <p className="mt-1 text-xs text-slate-400">
            {LIMIT} products per page
          </p>
        </div>
      </div>

      {/* ======================================================
          TOOLBAR
      ====================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-lg">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={handleSearch}
              placeholder="Search products by name..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />

            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                aria-label="Clear search"
              >
                <X size={17} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled
              title="Filters require category/status filters in the API."
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-400"
            >
              <SlidersHorizontal size={17} />

              <span className="hidden sm:inline">Filters</span>
            </button>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />

              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span>
            {search ? `Search results for "${search}"` : "All products"}
          </span>

          {!loading && totalProducts > 0 && (
            <span>
              Showing{" "}
              <strong className="text-slate-700">{pageInfo.from}</strong>–
              <strong className="text-slate-700">{pageInfo.to}</strong> of{" "}
              <strong className="text-slate-700">{totalProducts}</strong>
            </span>
          )}
        </div>
      </div>

      {/* ======================================================
          PRODUCT CONTENT
      ====================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="space-y-3 p-5">
            {Array.from({
              length: 7,
            }).map((_, index) => (
              <div
                key={index}
                className="h-16 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Package size={28} />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              No products found
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              {search
                ? `No products match "${search}". Try a different search term.`
                : "Your product catalog is currently empty. Add your first product to get started."}
            </p>

            {search ? (
              <button
                type="button"
                onClick={clearSearch}
                className="mt-5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Clear Search
              </button>
            ) : (
              <Link
                href="/admin/products/new"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                <Plus size={17} />
                Add Product
              </Link>
            )}
          </div>
        ) : (
          <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* ======================================================
          PAGINATION
      ====================================================== */}

      {!loading && products.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-500">
            Page <span className="font-semibold text-slate-800">{page}</span> of{" "}
            <span className="font-semibold text-slate-800">{totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPreviousPage}
              disabled={page === 1}
              className="inline-flex h-10 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={17} />

              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-slate-900 px-3 text-sm font-semibold text-white">
              {page}
            </div>

            <button
              type="button"
              onClick={goToNextPage}
              disabled={page >= totalPages}
              className="inline-flex h-10 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="hidden sm:inline">Next</span>

              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
