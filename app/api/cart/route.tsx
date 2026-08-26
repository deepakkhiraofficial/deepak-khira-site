"use client";
import React from "react";
import { useCart } from "@/components/cart/CartContext";

export default function CartPage() {
  const { items, loading, updateQuantity, remove, clear } = useCart();

  const subtotal = items.reduce(
    (sum, it) => sum + (it.product?.price || 0) * it.quantity,
    0
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {items.map((it) => (
            <div
              key={it.product._id}
              className="flex gap-4 items-center border p-4 rounded"
            >
              <img
                src={it.product.images?.[0] || "/placeholder.png"}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <div className="text-lg font-medium">{it.product.name}</div>
                <div className="text-sm text-gray-500">₹{it.product.price}</div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() =>
                      updateQuantity(
                        it.product._id,
                        Math.max(1, it.quantity - 1)
                      )
                    }
                    className="px-3 py-1 border rounded"
                  >
                    -
                  </button>
                  <div>{it.quantity}</div>
                  <button
                    onClick={() =>
                      updateQuantity(it.product._id, it.quantity + 1)
                    }
                    className="px-3 py-1 border rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => remove(it.product._id)}
                    className="ml-4 text-sm text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-right">
                ₹{(it.product.price || 0) * it.quantity}
              </div>
            </div>
          ))}

          <div className="text-right font-semibold">Subtotal: ₹{subtotal}</div>

          <div className="flex gap-2 justify-end mt-4">
            <button
              onClick={() => clear()}
              className="px-4 py-2 border rounded"
            >
              Clear Cart
            </button>
            <a
              href="/checkout"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Proceed to Checkout
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
