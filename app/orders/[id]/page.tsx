"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  CheckCircle2,
  Package,
  Truck,
  Home,
  XCircle,
  Clock3,
  ArrowLeft,
  MapPin,
  Phone,
  CreditCard,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";

type OrderStatus =
  | "placed"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

type OrderItem = {
  _id?: string;
  product?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type ShippingAddress = {
  fullName?: string;
  address?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
};

type StatusHistory = {
  _id?: string;
  status: string;
  message?: string;
  createdAt?: string;
};

type Order = {
  _id: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  payment: {
    method: string;
    paid: boolean;
    paidAt?: string;
    transactionId?: string;
  };
  itemsTotal: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  status: OrderStatus;
  statusHistory?: StatusHistory[];
  notes?: string;
  createdAt: string;
  updatedAt?: string;
};

const STATUS_STEPS: {
  key: OrderStatus;
  label: string;
  icon: React.ElementType;
}[] = [
  {
    key: "placed",
    label: "Order Placed",
    icon: ShoppingBag,
  },
  {
    key: "confirmed",
    label: "Confirmed",
    icon: CheckCircle2,
  },
  {
    key: "packed",
    label: "Packed",
    icon: Package,
  },
  {
    key: "shipped",
    label: "Shipped",
    icon: Truck,
  },
  {
    key: "delivered",
    label: "Delivered",
    icon: Home,
  },
];

function formatDate(date?: string) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function formatPrice(value?: number) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function getStatusIndex(status: OrderStatus) {
  return STATUS_STEPS.findIndex((step) => step.key === status);
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [order, setOrder] = useState<Order | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [refreshing, setRefreshing] = useState(false);

  // ============================================================
  // FETCH ORDER
  // ============================================================

  const fetchOrder = async (showRefresh = false) => {
    if (!id) return;

    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const res = await fetch(`/api/orders/${id}`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const contentType = res.headers.get("content-type") || "";

      let data: any;

      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        throw new Error("Invalid server response.");
      }

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Unable to load order.");
      }

      setOrder(data.order || data.data);
    } catch (err: any) {
      console.error("ORDER DETAILS ERROR:", err);

      setError(err?.message || "Unable to load order.");

      if (showRefresh) {
        toast.error(err?.message || "Failed to refresh order.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-slate-200" />
          <div className="h-40 rounded-2xl bg-white border" />
          <div className="h-72 rounded-2xl bg-white border" />
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl bg-white border shadow-sm p-8 text-center">
          <XCircle className="mx-auto h-14 w-14 text-red-500" />

          <h1 className="mt-5 text-2xl font-bold">Order Not Found</h1>

          <p className="mt-2 text-slate-500">
            {error || "We couldn't find this order."}
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => fetchOrder()}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              Try Again
            </button>

            <button
              onClick={() => router.push("/orders")}
              className="rounded-xl border px-5 py-3 font-semibold hover:bg-slate-50"
            >
              View My Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = getStatusIndex(order.status);

  const isCancelled = order.status === "cancelled";

  const isReturned = order.status === "returned";

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-6">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft size={17} />
            My Orders
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Order Details
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Order ID:{" "}
              <span className="font-semibold text-slate-700">#{order._id}</span>
            </p>

            <p className="text-sm text-slate-500">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          <button
            onClick={() => fetchOrder(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border bg-white px-4 py-2.5 font-medium hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* ======================================================
            STATUS BANNER
        ====================================================== */}

        <div
          className={`rounded-2xl border p-5 mb-6 ${
            isCancelled
              ? "bg-red-50 border-red-200"
              : isReturned
                ? "bg-orange-50 border-orange-200"
                : order.status === "delivered"
                  ? "bg-green-50 border-green-200"
                  : "bg-indigo-50 border-indigo-200"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`h-12 w-12 rounded-full flex items-center justify-center ${
                isCancelled
                  ? "bg-red-100 text-red-600"
                  : isReturned
                    ? "bg-orange-100 text-orange-600"
                    : order.status === "delivered"
                      ? "bg-green-100 text-green-600"
                      : "bg-indigo-100 text-indigo-600"
              }`}
            >
              {isCancelled || isReturned ? (
                <XCircle size={25} />
              ) : order.status === "delivered" ? (
                <CheckCircle2 size={25} />
              ) : (
                <Clock3 size={25} />
              )}
            </div>

            <div>
              <p className="text-sm text-slate-500">Current Status</p>

              <h2 className="text-xl font-bold capitalize">{order.status}</h2>
            </div>
          </div>
        </div>

        {/* ======================================================
            STATUS TIMELINE
        ====================================================== */}

        {!isCancelled && !isReturned && (
          <section className="bg-white border rounded-2xl shadow-sm p-5 md:p-7 mb-6">
            <h2 className="text-xl font-bold mb-8">Order Tracking</h2>

            <div className="relative">
              <div className="hidden md:block absolute left-0 right-0 top-6 h-1 bg-slate-200" />

              <div
                className="hidden md:block absolute left-0 top-6 h-1 bg-indigo-600 transition-all"
                style={{
                  width:
                    currentIndex <= 0
                      ? "0%"
                      : `${(currentIndex / (STATUS_STEPS.length - 1)) * 100}%`,
                }}
              />

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
                {STATUS_STEPS.map((step, index) => {
                  const Icon = step.icon;

                  const completed = index <= currentIndex;

                  return (
                    <div
                      key={step.key}
                      className="flex md:flex-col items-center md:text-center gap-3"
                    >
                      <div
                        className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${
                          completed
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-200 text-slate-400"
                        }`}
                      >
                        <Icon size={21} />
                      </div>

                      <div>
                        <p
                          className={`font-semibold text-sm ${
                            completed ? "text-indigo-600" : "text-slate-400"
                          }`}
                        >
                          {step.label}
                        </p>

                        {order.statusHistory
                          ?.filter((history) => history.status === step.key)
                          .slice(-1)
                          .map((history) => (
                            <p
                              key={history._id || history.createdAt}
                              className="text-xs text-slate-400 mt-1"
                            >
                              {formatDate(history.createdAt)}
                            </p>
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ======================================================
            MAIN CONTENT
        ====================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ====================================================
              PRODUCTS
          ==================================================== */}

          <section className="lg:col-span-2 bg-white border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b">
              <h2 className="text-xl font-bold">Ordered Products</h2>

              <p className="text-sm text-slate-500 mt-1">
                {order.items?.length || 0} product
                {order.items?.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="divide-y">
              {order.items?.map((item, index) => (
                <div
                  key={item._id || `${item.product}-${index}`}
                  className="p-5 flex gap-4"
                >
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900">
                      {item.name}
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      Quantity: {item.quantity}
                    </p>

                    <p className="text-sm text-slate-500">
                      Price: {formatPrice(item.price)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-lg">
                      {formatPrice(Number(item.price) * Number(item.quantity))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ====================================================
              ORDER SUMMARY
          ==================================================== */}

          <aside className="space-y-6">
            {/* SUMMARY */}

            <div className="bg-white border rounded-2xl shadow-sm p-5">
              <h2 className="text-xl font-bold mb-5">Payment Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Items Total</span>

                  <span className="font-medium">
                    {formatPrice(order.itemsTotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Shipping</span>

                  <span className="font-medium">
                    {formatPrice(order.shippingPrice)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Tax</span>

                  <span className="font-medium">
                    {formatPrice(order.taxPrice)}
                  </span>
                </div>

                <div className="border-t pt-4 flex justify-between">
                  <span className="font-bold text-lg">Total</span>

                  <span className="font-bold text-xl text-indigo-600">
                    {formatPrice(order.totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* PAYMENT */}

            <div className="bg-white border rounded-2xl shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="text-indigo-600" size={22} />

                <h2 className="text-lg font-bold">Payment</h2>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Method</span>

                  <span className="font-semibold uppercase">
                    {order.payment?.method}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Status</span>

                  <span
                    className={
                      order.payment?.paid
                        ? "text-green-600 font-semibold"
                        : "text-orange-600 font-semibold"
                    }
                  >
                    {order.payment?.paid ? "Paid" : "Pending"}
                  </span>
                </div>

                {order.payment?.transactionId && (
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Transaction</span>

                    <span className="font-medium text-right break-all">
                      {order.payment.transactionId}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ==================================================
                DELIVERY ADDRESS
            ================================================== */}

            <div className="bg-white border rounded-2xl shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="text-indigo-600" size={22} />

                <h2 className="text-lg font-bold">Delivery Address</h2>
              </div>

              <div className="text-sm text-slate-600 space-y-1">
                <p className="font-bold text-slate-900">
                  {order.shippingAddress?.fullName}
                </p>

                <p>{order.shippingAddress?.address}</p>

                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.region}
                </p>

                <p>PIN: {order.shippingAddress?.postalCode}</p>

                <p>{order.shippingAddress?.country}</p>

                {order.shippingAddress?.phone && (
                  <div className="flex items-center gap-2 pt-2 text-slate-700">
                    <Phone size={15} />

                    {order.shippingAddress.phone}
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* ======================================================
            FOOTER ACTIONS
        ====================================================== */}

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href="/orders"
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            View All Orders
          </Link>

          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-xl border bg-white px-6 py-3 font-semibold hover:bg-slate-50"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
