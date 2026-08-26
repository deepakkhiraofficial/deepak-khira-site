"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaMinus,
  FaPlus,
  FaRegTrashAlt,
  FaShieldAlt,
  FaTruck,
} from "react-icons/fa";

import { useCart } from "@/components/cart/CartContext";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  const [removingId, setRemovingId] = useState<string | null>(null);

  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.product.price ?? 0);
      return total + price * item.quantity;
    }, 0);
  }, [cartItems]);

  const totalItems = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 79;

  const total = subtotal + shipping;

  const handleRemove = (productId: string) => {
    setRemovingId(productId);

    setTimeout(() => {
      removeFromCart(productId);
      setRemovingId(null);
    }, 180);
  };

  /* =========================================================
     EMPTY CART
  ========================================================== */

  if (cartItems.length === 0) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-white dark:bg-slate-950">
        <section className="mx-auto flex min-h-[calc(100vh-160px)] max-w-7xl items-center justify-center px-6 py-16 sm:px-8 lg:px-12">
          <div className="w-full max-w-xl text-center">
            {/* Icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-9 w-9 text-slate-400"
                aria-hidden="true"
              >
                <path
                  d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <circle cx="10" cy="20" r="1" fill="currentColor" />

                <circle cx="18" cy="20" r="1" fill="currentColor" />
              </svg>
            </div>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
              Shopping Cart
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
              Your cart is empty
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              Looks like you haven&apos;t added anything to your cart yet.
              Explore our products and find something you&apos;ll love.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                Explore Products
                <FaArrowRight className="text-xs" />
              </Link>

              <Link
                href="/"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                <FaArrowLeft className="text-xs" />
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  /* =========================================================
     CART
  ========================================================== */

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-12">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
                Shopping Cart
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
                Your cart
              </h1>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Review your items before proceeding to checkout.
              </p>
            </div>

            <div className="text-sm text-slate-500 dark:text-slate-400">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* =================================================
              CART ITEMS
          ================================================== */}

          <div className="lg:col-span-8">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50">
              {/* Table Header */}
              <div className="hidden border-b border-slate-200 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400 md:grid md:grid-cols-[1fr_150px_120px] dark:border-slate-800">
                <span>Product</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Total</span>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {cartItems.map((item) => {
                  const productId = item.product._id;
                  const price = Number(item.product.price ?? 0);
                  const itemTotal = price * item.quantity;

                  return (
                    <article
                      key={productId}
                      className={`p-5 transition-opacity duration-200 sm:p-6 ${
                        removingId === productId ? "opacity-40" : "opacity-100"
                      }`}
                    >
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_150px_120px] md:items-center">
                        {/* Product */}
                        <div className="flex min-w-0 gap-4">
                          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                            {item.product.images?.[0] ? (
                              <Image
                                src={item.product.images[0]}
                                alt={item.product.name || "Product"}
                                fill
                                sizes="96px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                                No image
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <Link
                              href={`/products/${productId}`}
                              className="line-clamp-2 text-sm font-semibold leading-6 text-slate-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                            >
                              {item.product.name || "Product"}
                            </Link>

                            {price > 0 ? (
                              <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                                ₹{price.toLocaleString("en-IN")}
                              </p>
                            ) : (
                              <p className="mt-2 text-xs text-slate-400">
                                Price unavailable
                              </p>
                            )}

                            {/* Mobile Remove */}
                            <button
                              type="button"
                              onClick={() => handleRemove(productId)}
                              className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-red-500 md:hidden"
                            >
                              <FaRegTrashAlt />
                              Remove
                            </button>
                          </div>
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center justify-between md:justify-center">
                          <span className="text-xs font-medium text-slate-400 md:hidden">
                            Quantity
                          </span>

                          <div className="flex items-center overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                            <button
                              type="button"
                              aria-label={`Decrease quantity of ${item.product.name}`}
                              disabled={item.quantity <= 1}
                              onClick={() =>
                                updateQuantity(productId, item.quantity - 1)
                              }
                              className="flex h-9 w-9 items-center justify-center text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-slate-800 dark:hover:text-white"
                            >
                              <FaMinus className="text-[10px]" />
                            </button>

                            <span className="flex h-9 min-w-10 items-center justify-center border-x border-slate-200 px-2 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:text-white">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              aria-label={`Increase quantity of ${item.product.name}`}
                              onClick={() =>
                                updateQuantity(productId, item.quantity + 1)
                              }
                              className="flex h-9 w-9 items-center justify-center text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                            >
                              <FaPlus className="text-[10px]" />
                            </button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="flex items-center justify-between md:block md:text-right">
                          <span className="text-xs font-medium text-slate-400 md:hidden">
                            Total
                          </span>

                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                              {price > 0
                                ? `₹${itemTotal.toLocaleString("en-IN")}`
                                : "—"}
                            </p>

                            <button
                              type="button"
                              onClick={() => handleRemove(productId)}
                              className="mt-2 hidden items-center gap-1 text-xs font-medium text-slate-400 transition hover:text-red-500 md:inline-flex"
                            >
                              <FaRegTrashAlt />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Clear Cart */}
            <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
              >
                <FaArrowLeft className="text-xs" />
                Continue Shopping
              </Link>

              <button
                type="button"
                onClick={clearCart}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-red-500"
              >
                <FaRegTrashAlt className="text-xs" />
                Clear cart
              </button>
            </div>
          </div>

          {/* =================================================
              ORDER SUMMARY
          ================================================== */}

          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 dark:border-slate-800 dark:bg-slate-900/50">
                <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
                  Order summary
                </h2>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                      Subtotal
                    </span>

                    <span className="font-medium text-slate-900 dark:text-white">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                      Shipping
                    </span>

                    <span className="font-medium text-slate-900 dark:text-white">
                      {shipping === 0
                        ? "Free"
                        : `₹${shipping.toLocaleString("en-IN")}`}
                    </span>
                  </div>

                  <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-base font-semibold text-slate-950 dark:text-white">
                          Total
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Inclusive of applicable charges
                        </p>
                      </div>

                      <p className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                        ₹{total.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="group mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/10 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  Proceed to Checkout
                  <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                </Link>

                <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                  You can review your order again before payment.
                </p>
              </div>

              {/* Trust */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/50">
                  <FaShieldAlt className="text-sm text-slate-500 dark:text-slate-400" />

                  <p className="mt-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Secure checkout
                  </p>

                  <p className="mt-1 text-[11px] leading-4 text-slate-400">
                    Protected payment process
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/50">
                  <FaTruck className="text-sm text-slate-500 dark:text-slate-400" />

                  <p className="mt-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Reliable delivery
                  </p>

                  <p className="mt-1 text-[11px] leading-4 text-slate-400">
                    Delivery across India
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
