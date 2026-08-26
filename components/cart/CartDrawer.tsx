"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { toast } from "react-hot-toast";

import { useCart } from "@/components/cart/CartContext";

export default function CartDrawer() {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal } =
    useCart();

  const [open, setOpen] = useState(false);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const handleDecrease = (productId: string, quantity: number) => {
    updateQuantity(productId, Math.max(1, quantity - 1));
  };

  const handleIncrease = (
    productId: string,
    quantity: number,
    stock?: number | null
  ) => {
    if (typeof stock === "number" && stock > 0 && quantity >= stock) {
      toast.error("Maximum available stock reached.");
      return;
    }

    updateQuantity(productId, quantity + 1);
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
    toast.success("Product removed from cart.");
  };

  const handleClear = () => {
    if (items.length === 0) {
      return;
    }

    clearCart();
    toast.success("Cart cleared.");
  };

  return (
    <>
      {/* =====================================================
          CART BUTTON
      ====================================================== */}

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open cart with ${totalItems} items`}
        className="
          fixed
          bottom-6
          right-6
          z-50
          flex
          items-center
          gap-2
          rounded-full
          bg-blue-600
          px-5
          py-3
          font-semibold
          text-white
          shadow-xl
          transition
          hover:bg-blue-700
          active:scale-95
        "
      >
        <ShoppingCart size={20} />

        <span>Cart</span>

        {totalItems > 0 && (
          <span
            className="
              flex
              h-6
              min-w-6
              items-center
              justify-center
              rounded-full
              bg-white
              px-1.5
              text-xs
              font-bold
              text-blue-600
            "
          >
            {totalItems}
          </span>
        )}
      </button>

      {/* =====================================================
          OVERLAY
      ====================================================== */}

      {open && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            bg-black/50
            backdrop-blur-sm
          "
          onClick={() => setOpen(false)}
        >
          {/* =================================================
              DRAWER
          ================================================== */}

          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            onClick={(event) => event.stopPropagation()}
            className="
              absolute
              right-0
              top-0
              flex
              h-full
              w-full
              max-w-md
              flex-col
              bg-white
              shadow-2xl
              dark:bg-slate-950
            "
          >
            {/* =================================================
                HEADER
            ================================================== */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-slate-200
                px-5
                py-4
                dark:border-slate-800
              "
            >
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Your Cart
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {items.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      text-sm
                      font-semibold
                      text-red-600
                      transition
                      hover:text-red-700
                    "
                  >
                    <Trash2 size={15} />
                    Clear
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close cart"
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    text-slate-500
                    transition
                    hover:bg-slate-100
                    hover:text-slate-900
                    dark:hover:bg-slate-800
                    dark:hover:text-white
                  "
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* =================================================
                CART ITEMS
            ================================================== */}

            <div className="flex-1 overflow-y-auto px-5 py-5">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div
                    className="
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-full
                      bg-blue-50
                      text-blue-600
                      dark:bg-blue-950/40
                    "
                  >
                    <ShoppingCart size={28} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                    Your cart is empty
                  </h3>

                  <p className="mt-2 max-w-xs text-sm text-slate-500">
                    Add products to your cart and they will appear here.
                  </p>

                  <Link
                    href="/products"
                    onClick={() => setOpen(false)}
                    className="
                      mt-6
                      rounded-xl
                      bg-blue-600
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      text-white
                      transition
                      hover:bg-blue-700
                    "
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-5">
                  {items.map((item) => {
                    const product = item.product;

                    const image =
                      product.images?.[0] || "/placeholder-product.png";

                    const itemTotal = Number(product.price) * item.quantity;

                    return (
                      <div
                        key={product._id}
                        className="
                          rounded-2xl
                          border
                          border-slate-200
                          bg-slate-50
                          p-3
                          dark:border-slate-800
                          dark:bg-slate-900
                        "
                      >
                        <div className="flex gap-3">
                          {/* PRODUCT IMAGE */}

                          <Link
                            href={`/products/${product.slug || product._id}`}
                            onClick={() => setOpen(false)}
                            className="
                              relative
                              h-20
                              w-20
                              shrink-0
                              overflow-hidden
                              rounded-xl
                              bg-white
                              dark:bg-slate-800
                            "
                          >
                            <Image
                              src={image}
                              alt={product.name}
                              fill
                              sizes="80px"
                              className="object-contain p-2"
                            />
                          </Link>

                          {/* PRODUCT INFO */}

                          <div className="min-w-0 flex-1">
                            <Link
                              href={`/products/${product.slug || product._id}`}
                              onClick={() => setOpen(false)}
                              className="
                                line-clamp-2
                                text-sm
                                font-semibold
                                text-slate-900
                                hover:text-blue-600
                                dark:text-white
                                dark:hover:text-blue-400
                              "
                            >
                              {product.name}
                            </Link>

                            <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                              ₹{Number(product.price).toLocaleString("en-IN")}
                            </p>

                            {/* QUANTITY */}

                            <div className="mt-3 flex items-center justify-between">
                              <div
                                className="
                                  flex
                                  items-center
                                  overflow-hidden
                                  rounded-lg
                                  border
                                  border-slate-200
                                  dark:border-slate-700
                                "
                              >
                                <button
                                  type="button"
                                  aria-label="Decrease quantity"
                                  disabled={item.quantity <= 1}
                                  onClick={() =>
                                    handleDecrease(product._id, item.quantity)
                                  }
                                  className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    transition
                                    hover:bg-slate-100
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                    dark:hover:bg-slate-800
                                  "
                                >
                                  <Minus size={14} />
                                </button>

                                <span
                                  className="
                                    flex
                                    h-8
                                    min-w-9
                                    items-center
                                    justify-center
                                    border-x
                                    border-slate-200
                                    text-xs
                                    font-bold
                                    dark:border-slate-700
                                  "
                                >
                                  {item.quantity}
                                </span>

                                <button
                                  type="button"
                                  aria-label="Increase quantity"
                                  disabled={
                                    typeof product.stock === "number" &&
                                    product.stock > 0 &&
                                    item.quantity >= product.stock
                                  }
                                  onClick={() =>
                                    handleIncrease(
                                      product._id,
                                      item.quantity,
                                      product.stock
                                    )
                                  }
                                  className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    transition
                                    hover:bg-slate-100
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                    dark:hover:bg-slate-800
                                  "
                                >
                                  <Plus size={14} />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemove(product._id)}
                                className="
                                  text-xs
                                  font-semibold
                                  text-red-600
                                  transition
                                  hover:text-red-700
                                "
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* ITEM TOTAL */}

                        <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 text-sm dark:border-slate-800">
                          <span className="text-slate-500">Item Total</span>

                          <span className="font-bold text-slate-900 dark:text-white">
                            ₹{itemTotal.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* =================================================
                FOOTER
            ================================================== */}

            {items.length > 0 && (
              <div
                className="
                  border-t
                  border-slate-200
                  bg-white
                  px-5
                  py-5
                  dark:border-slate-800
                  dark:bg-slate-950
                "
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-slate-500">Subtotal</span>

                  <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <Link
                  href="/cart"
                  onClick={() => setOpen(false)}
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-600
                    px-5
                    py-3.5
                    font-bold
                    text-white
                    transition
                    hover:bg-blue-700
                  "
                >
                  View Cart
                </Link>

                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className="
                    mt-3
                    flex
                    w-full
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-slate-200
                    px-5
                    py-3.5
                    font-semibold
                    text-slate-700
                    transition
                    hover:bg-slate-50
                    dark:border-slate-700
                    dark:text-slate-200
                    dark:hover:bg-slate-900
                  "
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
