"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Order = {
  orderId: string;
  pricing: {
    subtotal: number;
    shipping: number;
    total: number;
  };
};

export default function ThankYouClient() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("lastOrder");

      if (!stored) return;

      const parsed: Order = JSON.parse(stored);

      if (parsed.orderId === orderId) {
        setOrder(parsed);
      }
    } catch (error) {
      console.error("ORDER LOAD ERROR:", error);
    }
  }, [orderId]);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-20 dark:bg-slate-950">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm dark:bg-slate-900">
        {/* SUCCESS ICON */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
          ✓
        </div>

        {/* TITLE */}
        <h1 className="mt-6 text-3xl font-bold">Order Placed Successfully!</h1>

        <p className="mt-3 text-gray-500">
          Thank you for shopping with Deepak Khira Enterprises.
        </p>

        {/* ORDER ID */}
        {orderId && (
          <div className="mt-6 rounded-xl bg-gray-50 p-4 dark:bg-slate-800">
            <p className="text-sm text-gray-500">Order ID</p>

            <p className="mt-1 break-all font-bold">{orderId}</p>
          </div>
        )}

        {/* ORDER TOTAL */}
        {order && (
          <div className="mt-4 rounded-xl border p-4 dark:border-slate-700">
            <div className="flex justify-between">
              <span>Subtotal</span>

              <span>₹{order.pricing.subtotal.toLocaleString("en-IN")}</span>
            </div>

            <div className="mt-2 flex justify-between">
              <span>Shipping</span>

              <span>₹{order.pricing.shipping.toLocaleString("en-IN")}</span>
            </div>

            <div className="mt-3 flex justify-between border-t pt-3 text-lg font-bold">
              <span>Total</span>

              <span className="text-blue-600">
                ₹{order.pricing.total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        )}

        {/* BUTTONS */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/products"
            className="flex-1 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Continue Shopping
          </Link>

          <Link
            href="/"
            className="flex-1 rounded-xl border px-5 py-3 font-semibold transition hover:bg-gray-50 dark:hover:bg-slate-800"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
