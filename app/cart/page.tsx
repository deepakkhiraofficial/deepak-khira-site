"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal } =
    useCart();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Shopping Cart
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Your Cart
          </h1>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Review your selected products before checkout.
          </p>
        </div>

        {/* =====================================================
            EMPTY CART
        ====================================================== */}

        {items.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <ShoppingBag size={30} />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Your cart is empty
            </h2>

            <p className="mx-auto mt-3 max-w-md text-slate-500 dark:text-slate-400">
              You haven't added any products yet. Explore our products and find
              something you like.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          /* =====================================================
             CART CONTENT
          ====================================================== */

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
            {/* =================================================
                PRODUCTS
            ================================================== */}

            <div className="space-y-4">
              {items.map((item) => {
                const product = item.product;

                const image = product.images?.[0] || "/placeholder-product.png";

                const itemTotal = Number(product.price) * item.quantity;

                const maxStock =
                  typeof product.stock === "number" &&
                  Number.isFinite(product.stock)
                    ? Math.max(0, product.stock)
                    : undefined;

                return (
                  <article
                    key={product._id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row">
                      {/* IMAGE */}

                      <Link
                        href={`/products/${product.slug || product._id}`}
                        className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-32 sm:w-32 dark:bg-slate-800"
                      >
                        <Image
                          src={image}
                          alt={product.name}
                          fill
                          sizes="128px"
                          className="object-contain p-3"
                        />
                      </Link>

                      {/* PRODUCT INFO */}

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex flex-col justify-between gap-3 sm:flex-row">
                          <div className="min-w-0">
                            {product.category && (
                              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-blue-600">
                                {product.category}
                              </p>
                            )}

                            <Link
                              href={`/products/${product.slug || product._id}`}
                              className="line-clamp-2 text-lg font-bold text-slate-900 transition hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                            >
                              {product.name}
                            </Link>

                            <p className="mt-2 text-base font-semibold text-slate-700 dark:text-slate-300">
                              ₹{Number(product.price).toLocaleString("en-IN")}
                            </p>
                          </div>

                          {/* TOTAL */}

                          <div className="text-left sm:text-right">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                              Total
                            </p>

                            <p className="text-lg font-extrabold text-slate-900 dark:text-white">
                              ₹{itemTotal.toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>

                        {/* ACTIONS */}

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                          {/* QUANTITY */}

                          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700">
                            <button
                              type="button"
                              aria-label={`Decrease quantity of ${product.name}`}
                              disabled={item.quantity <= 1}
                              onClick={() =>
                                updateQuantity(
                                  product._id,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              className="flex h-10 w-10 items-center justify-center text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                              <Minus size={16} />
                            </button>

                            <span className="flex h-10 min-w-12 items-center justify-center border-x border-slate-200 px-3 text-sm font-bold text-slate-900 dark:border-slate-700 dark:text-white">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              aria-label={`Increase quantity of ${product.name}`}
                              disabled={
                                maxStock !== undefined &&
                                item.quantity >= maxStock
                              }
                              onClick={() =>
                                updateQuantity(product._id, item.quantity + 1)
                              }
                              className="flex h-10 w-10 items-center justify-center text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          {/* REMOVE */}

                          <button
                            type="button"
                            onClick={() => removeFromCart(product._id)}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 transition hover:text-red-700 dark:text-red-400"
                          >
                            <Trash2 size={16} />
                            Remove
                          </button>
                        </div>

                        {/* STOCK */}

                        {maxStock !== undefined && (
                          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                            {maxStock > 0
                              ? `${maxStock} items available`
                              : "Currently out of stock"}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}

              {/* CLEAR CART */}

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-sm font-semibold text-red-600 transition hover:text-red-700 dark:text-red-400"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* =================================================
                ORDER SUMMARY
            ================================================== */}

            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:sticky lg:top-24">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Subtotal
                  </span>

                  <span className="font-semibold text-slate-900 dark:text-white">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Shipping
                  </span>

                  <span className="font-semibold text-green-600">
                    Calculated at checkout
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      Total
                    </span>

                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-7 flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.99]"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/products"
                className="mt-3 flex w-full items-center justify-center rounded-xl border border-slate-200 px-6 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Continue Shopping
              </Link>

              <p className="mt-5 text-center text-xs leading-5 text-slate-400">
                Secure checkout • Safe payment • Reliable delivery
              </p>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
