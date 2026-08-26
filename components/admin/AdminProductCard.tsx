"use client";

import Image from "next/image";
import Link from "next/link";
import type { ProductType } from "./ProductTable";

interface AdminProductCardProps {
  product: ProductType;
  onDelete: (id: string) => void;
  onEdit?: (id: string, newName: string) => void;
}

export default function AdminProductCard({
  product,
  onDelete,
}: AdminProductCardProps) {
  const image = product.images?.[0] || "/placeholder.png";

  const status = product.status || "active";

  return (
    <tr className="border-b border-slate-100 transition hover:bg-slate-50">
      {/* PRODUCT */}

      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border bg-slate-100">
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0">
            <p className="max-w-[280px] truncate font-semibold text-slate-900">
              {product.name}
            </p>

            {product.slug && (
              <p className="max-w-[280px] truncate text-xs text-slate-500">
                {product.slug}
              </p>
            )}
          </div>
        </div>
      </td>

      {/* CATEGORY */}

      <td className="px-5 py-4">
        <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          {product.category}
        </span>
      </td>

      {/* PRICE */}

      <td className="px-5 py-4">
        <span className="font-semibold text-slate-900">
          ₹{product.price.toLocaleString("en-IN")}
        </span>
      </td>

      {/* STOCK */}

      <td className="px-5 py-4">
        <span
          className={
            product.stock > 0
              ? "font-medium text-green-600"
              : "font-medium text-red-600"
          }
        >
          {product.stock}
        </span>
      </td>

      {/* STATUS */}

      <td className="px-5 py-4">
        <span
          className={
            status === "active"
              ? "rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
              : "rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700"
          }
        >
          {status}
        </span>
      </td>

      {/* ACTIONS */}

      <td className="px-5 py-4">
        <div className="flex items-center justify-center gap-2">
          <Link
            href={`/admin/products/${product._id}/edit`}
            className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-medium text-blue-600 transition hover:bg-blue-50"
          >
            Edit
          </Link>

          <button
            type="button"
            onClick={() => {
              const confirmed = window.confirm(`Delete "${product.name}"?`);

              if (confirmed) {
                onDelete(product._id);
              }
            }}
            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
