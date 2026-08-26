"use client";

import Link from "next/link";
import { Edit3, ExternalLink, Package, Trash2 } from "lucide-react";

export interface ProductType {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  category: string;
  price: number;
  stock: number;
  inStock: boolean;
  images?: string[];
  featured: boolean;
  status: "active" | "draft";
  rating?: number;
  popularityScore?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductTableProps {
  products: ProductType[];
  onDelete: (id: string) => void;
  onEdit?: (id: string, newName: string) => void;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function getStockStatus(stock: number) {
  if (stock <= 0) {
    return {
      label: "Out of stock",
      className: "bg-red-50 text-red-700 ring-red-600/10",
    };
  }

  if (stock <= 10) {
    return {
      label: "Low stock",
      className: "bg-amber-50 text-amber-700 ring-amber-600/10",
    };
  }

  return {
    label: "In stock",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  };
}

export default function ProductTable({
  products,
  onDelete,
}: ProductTableProps) {
  return (
    <>
      {/* =====================================================
          DESKTOP TABLE
      ===================================================== */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Product
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Category
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Price
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Inventory
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {products.map((product) => {
              const stockStatus = getStockStatus(product.stock);

              const image = product.images?.[0];

              return (
                <tr
                  key={product._id}
                  className="group transition hover:bg-slate-50/70"
                >
                  {/* PRODUCT */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                        {image ? (
                          <img
                            src={image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Package size={20} className="text-slate-400" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="max-w-[260px] truncate text-sm font-semibold text-slate-900">
                            {product.name}
                          </p>

                          {product.featured && (
                            <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                              Featured
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-xs text-slate-400">
                          ID: {product._id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* CATEGORY */}
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-slate-600">
                      {product.category}
                    </span>
                  </td>

                  {/* PRICE */}
                  <td className="px-5 py-4">
                    <span className="text-sm font-semibold text-slate-900">
                      {formatPrice(product.price)}
                    </span>
                  </td>

                  {/* INVENTORY */}
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-slate-800">
                        {product.stock}
                      </span>

                      <span
                        className={`w-fit rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${stockStatus.className}`}
                      >
                        {stockStatus.label}
                      </span>
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="px-5 py-4">
                    {product.status === "active" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                        Draft
                      </span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <Link
                        href={`/admin/products/${product._id}/edit`}
                        title="Edit product"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Edit3 size={17} />
                      </Link>

                      <Link
                        href={`/products/${product.slug}`}
                        target="_blank"
                        title="View product"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                      >
                        <ExternalLink size={17} />
                      </Link>

                      <button
                        type="button"
                        onClick={() => onDelete(product._id)}
                        title="Delete product"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* =====================================================
          MOBILE PRODUCT CARDS
      ===================================================== */}

      <div className="divide-y divide-slate-100 md:hidden">
        {products.map((product) => {
          const stockStatus = getStockStatus(product.stock);

          const image = product.images?.[0];

          return (
            <div key={product._id} className="p-4">
              <div className="flex gap-3">
                {/* IMAGE */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                  {image ? (
                    <img
                      src={image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package size={22} className="text-slate-400" />
                  )}
                </div>

                {/* INFO */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">
                        {product.name}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {product.category}
                      </p>
                    </div>

                    {product.featured && (
                      <span className="shrink-0 rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {formatPrice(product.price)}
                    </span>

                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${stockStatus.className}`}
                    >
                      {product.stock} · {stockStatus.label}
                    </span>

                    {product.status === "active" ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                        Draft
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* MOBILE ACTIONS */}
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/admin/products/${product._id}/edit`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <Edit3 size={16} />
                  Edit
                </Link>

                <Link
                  href={`/products/${product.slug}`}
                  target="_blank"
                  className="flex items-center justify-center rounded-xl border border-slate-200 px-3 py-2.5 text-slate-600 transition hover:bg-slate-50"
                  title="View product"
                >
                  <ExternalLink size={16} />
                </Link>

                <button
                  type="button"
                  onClick={() => onDelete(product._id)}
                  className="flex items-center justify-center rounded-xl border border-red-100 px-3 py-2.5 text-red-600 transition hover:bg-red-50"
                  title="Delete product"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
