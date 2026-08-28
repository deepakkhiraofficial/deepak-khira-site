"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Loader2,
  LogOut,
  Package,
  RefreshCw,
  ShoppingBag,
  User,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

// ============================================================
// TYPES
// ============================================================

type UserData = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

type OrderItem = {
  product?: string;
  name?: string;
  price?: number;
  quantity?: number;
  image?: string;
};

type Order = {
  _id?: string;
  id?: string;

  items?: OrderItem[];

  totalPrice?: number;
  itemsTotal?: number;
  shippingPrice?: number;
  taxPrice?: number;

  status?: string;

  payment?: {
    method?: string;
    paid?: boolean;
  };

  createdAt?: string;
  updatedAt?: string;
};

type AuthResponse = {
  success: boolean;
  authenticated: boolean;
  user: UserData | null;
};

type OrdersResponse = {
  success: boolean;
  orders?: Order[];
  count?: number;
  message?: string;
};

// ============================================================
// HELPERS
// ============================================================

function formatCurrency(value: number = 0) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatDate(date?: string) {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getOrderId(order: Order) {
  return order._id || order.id || "";
}

function getStatusLabel(status?: string) {
  if (!status) return "Processing";

  return status
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getStatusClasses(status?: string) {
  const normalized = String(status || "").toLowerCase();

  if (normalized === "delivered" || normalized === "completed") {
    return "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400";
  }

  if (
    normalized === "cancelled" ||
    normalized === "canceled" ||
    normalized === "failed"
  ) {
    return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400";
  }

  if (normalized === "shipped" || normalized === "out_for_delivery") {
    return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400";
  }

  return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400";
}

function getStatusIcon(status?: string) {
  const normalized = String(status || "").toLowerCase();

  if (normalized === "delivered" || normalized === "completed") {
    return CheckCircle2;
  }

  if (
    normalized === "cancelled" ||
    normalized === "canceled" ||
    normalized === "failed"
  ) {
    return XCircle;
  }

  if (normalized === "shipped" || normalized === "out_for_delivery") {
    return ShoppingBag;
  }

  return Clock3;
}

// ============================================================
// LOADING SKELETON
// ============================================================

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-32 rounded-3xl bg-gray-200 dark:bg-slate-800" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-28 rounded-2xl bg-gray-200 dark:bg-slate-800"
          />
        ))}
      </div>

      <div className="h-72 rounded-3xl bg-gray-200 dark:bg-slate-800" />
    </div>
  );
}

// ============================================================
// DASHBOARD
// ============================================================

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [error, setError] = useState("");

  // ==========================================================
  // LOAD DASHBOARD DATA
  // ==========================================================

  async function loadDashboard(showRefresh = false) {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      // ------------------------------------------------------
      // AUTH USER
      // ------------------------------------------------------

      const authResponse = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",

        // Don't unnecessarily cache logged-in user data.
        cache: "no-store",
      });

      let authData: AuthResponse;

      try {
        authData = await authResponse.json();
      } catch {
        throw new Error("Invalid authentication server response.");
      }

      if (
        !authResponse.ok ||
        !authData.success ||
        !authData.authenticated ||
        !authData.user
      ) {
        router.replace("/login");
        return;
      }

      // ------------------------------------------------------
      // ADMIN SHOULD USE ADMIN DASHBOARD
      // ------------------------------------------------------

      if (authData.user.role === "admin") {
        router.replace("/admin");
        return;
      }

      setUser(authData.user);

      // ------------------------------------------------------
      // USER ORDERS
      // ------------------------------------------------------

      const ordersResponse = await fetch("/api/orders", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      let ordersData: OrdersResponse;

      try {
        ordersData = await ordersResponse.json();
      } catch {
        throw new Error("Invalid orders server response.");
      }

      if (ordersResponse.status === 401) {
        router.replace("/login");
        return;
      }

      if (!ordersResponse.ok || !ordersData.success) {
        throw new Error(ordersData.message || "Unable to load your orders.");
      }

      setOrders(Array.isArray(ordersData.orders) ? ordersData.orders : []);
    } catch (err) {
      console.error("DASHBOARD LOAD ERROR:", err);

      const message =
        err instanceof Error ? err.message : "Unable to load dashboard.";

      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadDashboard();
  }, []);

  // ==========================================================
  // LOGOUT
  // ==========================================================

  async function logout() {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unable to sign out.");
      }

      toast.success("You have been signed out.");

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("LOGOUT ERROR:", error);

      toast.error("Unable to sign out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  // ==========================================================
  // DASHBOARD STATS
  // ==========================================================

  const statistics = useMemo(() => {
    const totalOrders = orders.length;

    const deliveredOrders = orders.filter((order) => {
      const status = String(order.status || "").toLowerCase();

      return status === "delivered" || status === "completed";
    }).length;

    const totalSpent = orders.reduce(
      (total, order) => total + Number(order.totalPrice || 0),
      0
    );

    return {
      totalOrders,
      deliveredOrders,
      totalSpent,
    };
  }, [orders]);

  // ==========================================================
  // RECENT ORDERS
  // ==========================================================

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();

        const dateB = new Date(b.createdAt || 0).getTime();

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [orders]);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <DashboardSkeleton />
        </div>
      </main>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error && !user) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-16 dark:bg-slate-950 sm:px-6">
        <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 text-center shadow-sm dark:bg-slate-900">
          <XCircle className="mx-auto h-12 w-12 text-red-500" />

          <h1 className="mt-4 text-2xl font-bold">Unable to load dashboard</h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
            {error}
          </p>

          <button
            type="button"
            onClick={() => loadDashboard()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ====================================================
            HEADER
        ==================================================== */}

        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 text-white shadow-lg sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100">My Account</p>

              <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
                Welcome back, {user?.name || "Customer"}!
              </h1>

              <p className="mt-2 text-sm text-blue-100 sm:text-base">
                Manage your orders and account from one place.
              </p>

              {user?.email && (
                <p className="mt-2 text-sm text-blue-200">{user.email}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => loadDashboard(true)}
                disabled={refreshing}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/15 px-4 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {refreshing ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <RefreshCw size={17} />
                )}
                Refresh
              </button>

              <button
                type="button"
                onClick={logout}
                disabled={loggingOut}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loggingOut ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <LogOut size={17} />
                )}

                {loggingOut ? "Signing out..." : "Sign out"}
              </button>
            </div>
          </div>
        </section>

        {/* ====================================================
            ERROR BANNER
        ==================================================== */}

        {error && (
          <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => loadDashboard(true)}
              className="shrink-0 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* ====================================================
            STATISTICS
        ==================================================== */}

        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* TOTAL ORDERS */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Total Orders
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {statistics.totalOrders}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <Package size={24} />
              </div>
            </div>
          </div>

          {/* DELIVERED */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Delivered Orders
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {statistics.deliveredOrders}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400">
                <CheckCircle2 size={24} />
              </div>
            </div>
          </div>

          {/* TOTAL SPENT */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Total Spent
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {formatCurrency(statistics.totalSpent)}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                <ShoppingBag size={24} />
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            QUICK ACTIONS
        ==================================================== */}

        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link
            href="/products"
            className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold">Continue Shopping</h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                  Explore our latest products.
                </p>
              </div>

              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </div>
          </Link>

          <Link
            href="/orders"
            className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold">My Orders</h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                  View your complete order history.
                </p>
              </div>

              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </div>
          </Link>

          <Link
            href="/account"
            className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold">My Account</h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                  Manage your profile and settings.
                </p>
              </div>

              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </div>
          </Link>
        </section>

        {/* ====================================================
            RECENT ORDERS
        ==================================================== */}

        <section className="mt-6 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
            <div>
              <h2 className="text-xl font-bold">Recent Orders</h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                Your latest purchases
              </p>
            </div>

            <Link
              href="/orders"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View all
              <ArrowRight size={16} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 dark:text-slate-700" />

              <h3 className="mt-4 text-lg font-bold">No orders yet</h3>

              <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
                Your orders will appear here after you make a purchase.
              </p>

              <Link
                href="/products"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Start Shopping
                <ArrowRight size={17} />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-slate-800">
              {recentOrders.map((order, index) => {
                const orderId = getOrderId(order);

                const StatusIcon = getStatusIcon(order.status);

                return (
                  <div
                    key={orderId || `order-${index}`}
                    className="p-5 transition hover:bg-gray-50 dark:hover:bg-slate-800/50"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      {/* ORDER INFO */}

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold">
                            Order #
                            {orderId ? orderId.slice(-8).toUpperCase() : "N/A"}
                          </span>

                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                              order.status
                            )}`}
                          >
                            <StatusIcon size={13} />

                            {getStatusLabel(order.status)}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-slate-400">
                          <span>{formatDate(order.createdAt)}</span>

                          <span>
                            {Array.isArray(order.items)
                              ? order.items.reduce(
                                  (total, item) =>
                                    total + Number(item.quantity || 0),
                                  0
                                )
                              : 0}{" "}
                            item(s)
                          </span>

                          {order.payment?.method && (
                            <span>{order.payment.method}</span>
                          )}
                        </div>
                      </div>

                      {/* ORDER PRICE + VIEW */}

                      <div className="flex items-center justify-between gap-5 sm:justify-end">
                        <div className="text-left sm:text-right">
                          <p className="text-xs text-gray-500 dark:text-slate-400">
                            Total
                          </p>

                          <p className="mt-1 text-lg font-bold">
                            {formatCurrency(Number(order.totalPrice || 0))}
                          </p>
                        </div>

                        {orderId ? (
                          <Link
                            href={`/orders/${orderId}`}
                            className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold transition hover:bg-gray-100 dark:border-slate-700 dark:hover:bg-slate-800"
                          >
                            View
                            <ArrowRight size={16} />
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ====================================================
            ACCOUNT INFORMATION
        ==================================================== */}

        <section className="mt-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <User size={22} />
            </div>

            <div>
              <h2 className="font-bold">Account Information</h2>

              <p className="text-sm text-gray-500 dark:text-slate-400">
                Your current account details
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-slate-800">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-slate-400">
                Name
              </p>

              <p className="mt-1 font-semibold">
                {user?.name || "Not available"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 dark:bg-slate-800">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-slate-400">
                Email
              </p>

              <p className="mt-1 break-all font-semibold">
                {user?.email || "Not available"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
