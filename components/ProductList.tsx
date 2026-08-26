"use client";

import React from "react";
import { ProductType } from "@/components/admin/ProductTable";
import { FaEdit, FaTrash } from "react-icons/fa";

type Props = {
  products: ProductType[];
  selectedIds: string[];
  toggleSelect: (id: string | "selectAll" | "clearAll") => void;
  onEdit: (product: ProductType) => void;
  onDelete: (id: string) => void;
};

export default function ProductList({
  products,
  selectedIds,
  toggleSelect,
  onEdit,
  onDelete,
}: Props) {
  if (!products?.length) {
    return (
      <p className="text-gray-500 text-center py-10">No products found.</p>
    );
  }

  const allSelected = selectedIds.length === products.length;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border-b">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() =>
                  toggleSelect(allSelected ? "clearAll" : "selectAll")
                }
              />
            </th>

            <th className="p-3 border-b text-left">Name</th>
            <th className="p-3 border-b text-left">Category</th>
            <th className="p-3 border-b text-left">Price</th>
            <th className="p-3 border-b text-left">Stock</th>
            <th className="p-3 border-b text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p, idx) => (
            <tr
              key={p._id}
              className={`hover:bg-gray-50 transition ${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <td className="p-3 text-center border-b">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(p._id)}
                  onChange={() => toggleSelect(p._id)}
                />
              </td>

              <td className="p-3 border-b font-medium">{p.name}</td>

              <td className="p-3 border-b">{p.category || "—"}</td>

              <td className="p-3 border-b">
                ₹{p.price.toLocaleString("en-IN")}
              </td>

              <td className="p-3 border-b">{p.stock ?? 0}</td>

              <td className="p-3 border-b flex items-center gap-2">
                <button
                  type="button"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                  onClick={() => onEdit(p)}
                >
                  <FaEdit />
                  Edit
                </button>

                <button
                  type="button"
                  className="flex items-center gap-1 text-red-600 hover:text-red-800"
                  onClick={() => onDelete(p._id)}
                >
                  <FaTrash />
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
