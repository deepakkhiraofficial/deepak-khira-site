"use client";

import { useEffect, useState } from "react";

export default function OrderDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [order, setOrder] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [id, setId] = useState("");

  // ============================================================
  // GET ORDER ID FROM NEXT.JS 16 PARAMS
  // ============================================================

  useEffect(() => {
    let mounted = true;

    async function resolveParams() {
      try {
        const resolved = await params;

        if (!resolved?.id) {
          throw new Error("Order ID is missing.");
        }

        if (mounted) {
          setId(resolved.id);
        }
      } catch (error) {
        console.error("PARAM ERROR:", error);

        if (mounted) {
          setError("Invalid order URL.");
          setLoading(false);
        }
      }
    }

    resolveParams();

    return () => {
      mounted = false;
    };
  }, [params]);

  // ============================================================
  // LOAD ADMIN ORDER
  // ============================================================

  useEffect(() => {
    if (!id) {
      return;
    }

    const controller = new AbortController();

    async function loadOrder() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/admin/orders/${id}`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "Unable to load order.");
        }

        if (!data?.success) {
          throw new Error(data?.message || "Unable to load order.");
        }

        setOrder(data.order);
      } catch (error: any) {
        if (error?.name === "AbortError") {
          return;
        }

        console.error("ORDER DETAILS ERROR:", error);

        setError(error?.message || "Unable to load order.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadOrder();

    return () => {
      controller.abort();
    };
  }, [id]);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200" />

          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-gray-100" />
        </div>

        <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-800">Unable to load order</h2>

        <p className="mt-1 text-sm text-red-600">{error}</p>
      </div>
    );
  }

  // ============================================================
  // ORDER NOT FOUND
  // ============================================================

  if (!order) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
        <h2 className="font-semibold text-gray-900">Order not found</h2>

        <p className="mt-2 text-sm text-gray-500">
          The requested order could not be found.
        </p>
      </div>
    );
  }

  // ============================================================
  // SAFE ITEMS
  // ============================================================

  const items = Array.isArray(order.items) ? order.items : [];

  // ============================================================
  // FORMAT MONEY
  // ============================================================

  const formatMoney = (value: any) => {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
  };

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div>
        <p className="text-sm font-medium text-blue-600">Admin Management</p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
          Order Details
        </h1>

        <p className="mt-2 break-all text-sm text-gray-500">
          Order ID: {order._id}
        </p>
      </div>

      {/* ORDER SUMMARY */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Status</p>

          <p className="mt-2 text-lg font-semibold capitalize text-gray-900">
            {order.status || "Unknown"}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Payment</p>

          <p className="mt-2 text-lg font-semibold text-gray-900">
            {order.payment?.method || "N/A"}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total</p>

          <p className="mt-2 text-lg font-semibold text-gray-900">
            {formatMoney(order.totalPrice)}
          </p>
        </div>
      </div>

      {/* CUSTOMER */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Customer</h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Name
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {order.user?.name || order.shippingAddress?.fullName || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Email
            </p>

            <p className="mt-1 text-gray-900">{order.user?.email || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* SHIPPING ADDRESS */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Shipping Address
        </h2>

        <div className="mt-4 text-sm leading-6 text-gray-600">
          <p className="font-medium text-gray-900">
            {order.shippingAddress?.fullName || "N/A"}
          </p>

          <p>{order.shippingAddress?.address || ""}</p>

          <p>
            {order.shippingAddress?.city || ""}
            {order.shippingAddress?.region
              ? `, ${order.shippingAddress.region}`
              : ""}
          </p>

          <p>{order.shippingAddress?.postalCode || ""}</p>

          <p>{order.shippingAddress?.country || "India"}</p>

          <p className="mt-2">Phone: {order.shippingAddress?.phone || "N/A"}</p>
        </div>
      </div>

      {/* ITEMS */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Items</h2>

          <span className="text-sm text-gray-500">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>

        {items.length > 0 ? (
          <div className="mt-4 divide-y">
            {items.map((item: any, index: number) => (
              <div
                key={item._id || item.product || index}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {item.name || "Product"}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Quantity: {item.quantity || 0}
                  </p>
                </div>

                <div className="font-semibold text-gray-900">
                  {formatMoney(
                    Number(item.price || 0) * Number(item.quantity || 0)
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
            No items found for this order.
          </div>
        )}
      </div>

      {/* PRICE SUMMARY */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Price Summary</h2>

        <div className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Items total</span>

            <span className="font-medium text-gray-900">
              {formatMoney(order.itemsTotal)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Shipping</span>

            <span className="font-medium text-gray-900">
              {formatMoney(order.shippingPrice)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Tax</span>

            <span className="font-medium text-gray-900">
              {formatMoney(order.taxPrice)}
            </span>
          </div>

          <div className="flex justify-between border-t pt-4 text-base">
            <span className="font-semibold text-gray-900">Total</span>

            <span className="font-bold text-gray-900">
              {formatMoney(order.totalPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
