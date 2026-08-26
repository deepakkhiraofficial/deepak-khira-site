"use client";
import React, { useState } from "react";
import { useCart } from "@/components/cart/CartContext";
import { toast } from "react-hot-toast";

export default function CartDrawer() {
  const { items, updateQuantity, remove, clear } = useCart();
  const [open, setOpen] = useState(false);

  const subtotal = items.reduce(
    (sum, it) => sum + (it.product?.price || 0) * it.quantity,
    0
  );

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg z-50"
      >
        Cart ({items.length})
      </button>

      {/* Drawer Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 flex justify-end">
          <div className="w-full max-w-md bg-white h-full p-6 overflow-auto relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Your Cart</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    clear();
                    toast.success("Cart cleared");
                  }}
                  className="text-sm text-red-500"
                >
                  Clear
                </button>
                <button onClick={() => setOpen(false)} className="text-sm">
                  Close
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="space-y-4">
              {items.length === 0 ? (
                <p className="text-gray-500">Cart is empty</p>
              ) : (
                items.map((it) => (
                  <div
                    key={it.product._id}
                    className="flex gap-3 items-center border-b pb-3"
                  >
                    <img
                      src={it.product.images?.[0] || "/placeholder.png"}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{it.product.name}</div>
                      <div className="text-sm text-gray-500">
                        ₹{it.product.price}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              it.product._id,
                              Math.max(1, it.quantity - 1)
                            ) && toast.success("Updated")
                          }
                          className="px-2 py-1 border rounded"
                        >
                          -
                        </button>
                        <div>{it.quantity}</div>
                        <button
                          onClick={() =>
                            updateQuantity(it.product._id, it.quantity + 1) &&
                            toast.success("Updated")
                          }
                          className="px-2 py-1 border rounded"
                        >
                          +
                        </button>
                        <button
                          onClick={() =>
                            remove(it.product._id) && toast.success("Removed")
                          }
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
                ))
              )}
            </div>

            {/* Subtotal & Checkout */}
            {items.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between font-semibold mb-4">
                  <div>Subtotal</div>
                  <div>₹{subtotal}</div>
                </div>
                <a
                  href="/cart"
                  className="block w-full text-center py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Go to Cart / Checkout
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
