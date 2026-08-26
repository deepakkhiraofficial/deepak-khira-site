"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  Loader2,
  ChevronRight,
  RefreshCcw,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

type OrderItem = {
  product?: {
    _id?: string;
    name?: string;
    images?: string[];
    price?: number;
  };
  productId?: string;
  name?: string;
  image?: string;
  price?: number;
  quantity: number;
};

type Order = {
  _id: string;
  orderId?: string;
  items: OrderItem[];
  subtotal?: number;
  shipping?: number;
  total?: number;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  createdAt: string;
};

function formatDate(date: string) {
  try {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return date;
  }
}

function formatCurrency(value: number = 0) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getStatusClasses(status = "") {
  const value = status.toLowerCase();

  if (value.includes("delivered") || value.includes("completed")) {
    return "bg-green-100 text-green-700";
  }

  if (value.includes("cancel")) {
    return "bg-red-100 text-red-700";
  }

  if (value.includes("ship")) {
    return "bg-blue-100 text-blue-700";
  }

  if (value.includes("process") || value.includes("confirm")) {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-slate-100 text-slate-700";
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // FETCH ORDERS
  // ============================================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/orders", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();

      if (res.status === 401) {
        window.location.href = "/login?redirect=%2Forders";
        return;
      }

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Unable to load orders.");
      }

      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (err: any) {
      console.error("ORDERS FETCH ERROR:", err);

      setError(err.message || "Unable to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    fetchOrders();
  }, []);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />

            <p className="text-sm text-slate-500">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertCircle className="h-8 w-8" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Unable to load orders
          </h1>

          <p className="mt-2 text-slate-500">{error}</p>

          <button
            onClick={fetchOrders}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // EMPTY ORDERS
  // ============================================================

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <ShoppingBag className="h-10 w-10" />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-slate-900">
            No orders yet
          </h1>

          <p className="mx-auto mt-3 max-w-md text-slate-500">
            You haven't placed any orders yet. Explore our products and find
            something you love.
          </p>

          <Link
            href="/products"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            <Package className="h-5 w-5" />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  // ============================================================
  // ORDERS PAGE
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-indigo-600">My Account</p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              My Orders
            </h1>

            <p className="mt-2 text-slate-500">
              Track and manage your recent purchases.
            </p>
          </div>

          <button
            onClick={fetchOrders}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* ORDER COUNT */}
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Package className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm text-slate-500">Total Orders</p>

              <p className="text-xl font-bold text-slate-900">
                {orders.length}
              </p>
            </div>
          </div>
        </div>

        {/* ORDERS */}
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order._id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              {/* ORDER HEADER */}
              <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-bold text-slate-900">
                      Order #
                      {order.orderId || order._id.slice(-8).toUpperCase()}
                    </h2>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                        order.status
                      )}`}
                    >
                      {order.status || "Processing"}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-xs text-slate-500">Order Total</p>

                  <p className="text-xl font-bold text-slate-900">
                    {formatCurrency(order.total || 0)}
                  </p>
                </div>
              </div>

              {/* ORDER ITEMS */}
              <div className="divide-y divide-slate-100">
                {order.items?.map((item, index) => {
                  const image =
                    item.image ||
                    item.product?.images?.[0] ||
                    "/placeholder.png";

                  const name = item.name || item.product?.name || "Product";

                  const price = item.price || item.product?.price || 0;

                  return (
                    <div
                      key={`${order._id}-${index}`}
                      className="flex gap-4 p-5"
                    >
                      {/* IMAGE */}
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                        <img
                          src={image}
                          alt={name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* DETAILS */}
                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 font-semibold text-slate-900">
                          {name}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Quantity: {item.quantity}
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-700">
                          {formatCurrency(price)}
                        </p>
                      </div>

                      {/* ITEM TOTAL */}
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">
                          {formatCurrency(price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ORDER FOOTER */}
              <div className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <div>
                    <span className="text-slate-500">Payment:</span>{" "}
                    <span className="font-medium capitalize text-slate-700">
                      {order.paymentStatus || order.paymentMethod || "Pending"}
                    </span>
                  </div>

                  {order.shipping !== undefined && (
                    <div>
                      <span className="text-slate-500">Shipping:</span>{" "}
                      <span className="font-medium text-slate-700">
                        {formatCurrency(order.shipping)}
                      </span>
                    </div>
                  )}
                </div>

                <Link
                  href={`/orders/${order._id}`}
                  className="inline-flex items-center justify-center gap-1 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-indigo-50"
                >
                  View Details
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
