import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/auth";

import {
  Users,
  ShieldCheck,
  Package,
  PackageCheck,
  FileEdit,
  Star,
  AlertTriangle,
  XCircle,
  ShoppingBag,
  IndianRupee,
  RotateCcw,
  ArrowRight,
  Clock3,
  CheckCircle2,
} from "lucide-react";

import Link from "next/link";

export const dynamic = "force-dynamic";

// ============================================================
// HELPERS
// ============================================================

function formatNumber(value: number) {
  return value.toLocaleString("en-IN");
}

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function statusClass(status: string) {
  switch (status) {
    case "placed":
      return "bg-blue-50 text-blue-700";

    case "confirmed":
      return "bg-indigo-50 text-indigo-700";

    case "packed":
      return "bg-violet-50 text-violet-700";

    case "shipped":
      return "bg-amber-50 text-amber-700";

    case "delivered":
      return "bg-emerald-50 text-emerald-700";

    case "cancelled":
      return "bg-red-50 text-red-700";

    case "returned":
      return "bg-orange-50 text-orange-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

// ============================================================
// DASHBOARD
// ============================================================

export default async function AdminDashboard() {
  // ==========================================================
  // ADMIN AUTHORIZATION
  // ==========================================================

  const admin = await requireAdmin();

  if (!admin) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <ShieldCheck size={40} className="mx-auto text-red-500" />

          <h1 className="mt-4 text-xl font-bold text-red-900">
            Admin Authorization Required
          </h1>

          <p className="mt-2 text-sm text-red-700">
            Please login as administrator to access the dashboard.
          </p>

          <Link
            href="/admin/login"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
          >
            Go to Login
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================================
  // DATABASE
  // ==========================================================

  await connectDB();

  // ==========================================================
  // LOAD DASHBOARD DATA IN PARALLEL
  // ==========================================================

  const [
    totalUsers,
    totalAdmins,

    totalProducts,
    activeProducts,
    draftProducts,
    featuredProducts,
    lowStockProducts,
    outOfStockProducts,

    totalOrders,
    pendingOrders,
    deliveredOrders,
    cancelledOrders,
    returnedOrders,

    revenueResult,

    recentOrders,
  ] = await Promise.all([
    // ========================================================
    // USERS
    // ========================================================

    User.countDocuments({
      role: "user",
    }),

    User.countDocuments({
      role: "admin",
    }),

    // ========================================================
    // PRODUCTS
    // ========================================================

    Product.countDocuments(),

    Product.countDocuments({
      status: "active",
    }),

    Product.countDocuments({
      status: "draft",
    }),

    Product.countDocuments({
      status: "active",
      featured: true,
    }),

    Product.countDocuments({
      status: "active",
      stock: {
        $gt: 0,
        $lte: 10,
      },
    }),

    Product.countDocuments({
      stock: {
        $lte: 0,
      },
    }),

    // ========================================================
    // ORDERS
    // ========================================================

    Order.countDocuments(),

    Order.countDocuments({
      status: {
        $in: ["placed", "confirmed", "packed"],
      },
    }),

    Order.countDocuments({
      status: "delivered",
    }),

    Order.countDocuments({
      status: "cancelled",
    }),

    Order.countDocuments({
      status: "returned",
    }),

    // ========================================================
    // REVENUE
    //
    // IMPORTANT:
    // Your Order model uses totalPrice.
    // ========================================================

    Order.aggregate([
      {
        $match: {
          status: {
            $nin: ["cancelled", "returned"],
          },
        },
      },

      {
        $group: {
          _id: null,

          totalRevenue: {
            $sum: "$totalPrice",
          },
        },
      },
    ]),

    // ========================================================
    // RECENT ORDERS
    // ========================================================

    Order.find({})
      .sort({
        createdAt: -1,
      })
      .limit(8)
      .select("_id user items totalPrice status createdAt")
      .populate("user", "name email")
      .lean(),
  ]);

  // ==========================================================
  // REVENUE
  // ==========================================================

  const totalRevenue = Number(revenueResult?.[0]?.totalRevenue) || 0;

  // ==========================================================
  // ADMIN NAME
  // ==========================================================

  const adminName =
    typeof admin === "object" && admin !== null && "name" in admin
      ? String((admin as { name?: string }).name || "Administrator")
      : "Administrator";

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="space-y-8">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <section className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-xl sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-300">Admin Overview</p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back, {adminName}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Monitor your e-commerce business, products, orders, customers and
              inventory from one place.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <CheckCircle2 size={20} className="text-emerald-400" />

            <div>
              <p className="text-xs text-slate-400">System Status</p>

              <p className="text-sm font-semibold text-white">Operational</p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          SALES OVERVIEW
      ====================================================== */}

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">Sales Overview</h2>

          <p className="mt-1 text-sm text-slate-500">
            Your current order and revenue performance.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {/* TOTAL ORDERS */}

          <StatCard
            title="Total Orders"
            value={formatNumber(totalOrders)}
            icon={<ShoppingBag size={21} />}
            iconClass="bg-blue-50 text-blue-600"
          />

          {/* PENDING */}

          <StatCard
            title="Pending Orders"
            value={formatNumber(pendingOrders)}
            icon={<Clock3 size={21} />}
            iconClass="bg-amber-50 text-amber-600"
          />

          {/* DELIVERED */}

          <StatCard
            title="Delivered Orders"
            value={formatNumber(deliveredOrders)}
            icon={<PackageCheck size={21} />}
            iconClass="bg-emerald-50 text-emerald-600"
          />

          {/* REVENUE */}

          <StatCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            icon={<IndianRupee size={21} />}
            iconClass="bg-violet-50 text-violet-600"
          />
        </div>
      </section>

      {/* ======================================================
          BUSINESS OVERVIEW
      ====================================================== */}

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            Business Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Users and administrator accounts.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Users"
            value={formatNumber(totalUsers)}
            icon={<Users size={21} />}
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatCard
            title="Admin Accounts"
            value={formatNumber(totalAdmins)}
            icon={<ShieldCheck size={21} />}
            iconClass="bg-violet-50 text-violet-600"
          />

          <StatCard
            title="Cancelled Orders"
            value={formatNumber(cancelledOrders)}
            icon={<XCircle size={21} />}
            iconClass="bg-red-50 text-red-600"
          />

          <StatCard
            title="Returned Orders"
            value={formatNumber(returnedOrders)}
            icon={<RotateCcw size={21} />}
            iconClass="bg-orange-50 text-orange-600"
          />
        </div>
      </section>

      {/* ======================================================
          PRODUCT & INVENTORY
      ====================================================== */}

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            Product & Inventory
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Current product catalog and stock status.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Products"
            value={formatNumber(totalProducts)}
            icon={<Package size={21} />}
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatCard
            title="Active Products"
            value={formatNumber(activeProducts)}
            icon={<PackageCheck size={21} />}
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            title="Draft Products"
            value={formatNumber(draftProducts)}
            icon={<FileEdit size={21} />}
            iconClass="bg-slate-100 text-slate-600"
          />

          <StatCard
            title="Featured Products"
            value={formatNumber(featuredProducts)}
            icon={<Star size={21} />}
            iconClass="bg-yellow-50 text-yellow-600"
          />
        </div>
      </section>

      {/* ======================================================
          INVENTORY ALERTS
      ====================================================== */}

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">Inventory Alerts</h2>

          <p className="mt-1 text-sm text-slate-500">
            Products that may require your attention.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* LOW STOCK */}

          <Link
            href="/admin/products"
            className="group rounded-2xl border border-amber-200 bg-amber-50 p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm">
                  <AlertTriangle size={21} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-amber-900">
                    Low Stock
                  </p>

                  <p className="mt-0.5 text-xs text-amber-700">
                    Products with 1–10 units
                  </p>
                </div>
              </div>

              <ArrowRight
                size={18}
                className="text-amber-500 transition group-hover:translate-x-1"
              />
            </div>

            <p className="mt-5 text-3xl font-bold text-amber-900">
              {formatNumber(lowStockProducts)}
            </p>
          </Link>

          {/* OUT OF STOCK */}

          <Link
            href="/admin/products"
            className="group rounded-2xl border border-red-200 bg-red-50 p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm">
                  <XCircle size={21} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-red-900">
                    Out of Stock
                  </p>

                  <p className="mt-0.5 text-xs text-red-700">
                    Products with zero stock
                  </p>
                </div>
              </div>

              <ArrowRight
                size={18}
                className="text-red-500 transition group-hover:translate-x-1"
              />
            </div>

            <p className="mt-5 text-3xl font-bold text-red-900">
              {formatNumber(outOfStockProducts)}
            </p>
          </Link>
        </div>
      </section>

      {/* ======================================================
          RECENT ORDERS
      ====================================================== */}

      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Recent Orders</h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest orders placed by your customers.
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View all orders
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Order
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Customer
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Items
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Amount
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center">
                      <ShoppingBag
                        size={32}
                        className="mx-auto text-slate-300"
                      />

                      <p className="mt-3 text-sm font-medium text-slate-600">
                        No orders found
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        New customer orders will appear here.
                      </p>
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order: any) => (
                    <tr
                      key={String(order._id)}
                      className="transition hover:bg-slate-50"
                    >
                      {/* ORDER */}

                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/orders/${order._id}`}
                          className="font-semibold text-blue-600 hover:text-blue-700"
                        >
                          #{String(order._id).slice(-8).toUpperCase()}
                        </Link>
                      </td>

                      {/* CUSTOMER */}

                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-800">
                          {order.user?.name || "Guest Customer"}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {order.user?.email || "—"}
                        </p>
                      </td>

                      {/* ITEMS */}

                      <td className="px-5 py-4">
                        <span className="text-sm font-medium text-slate-700">
                          {order.items?.length || 0}
                        </span>
                      </td>

                      {/* AMOUNT */}

                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-slate-900">
                          {formatCurrency(Number(order.totalPrice) || 0)}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      {/* DATE */}

                      <td className="whitespace-nowrap px-5 py-4">
                        <span className="text-xs text-slate-500">
                          {formatDate(order.createdAt)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ======================================================
          QUICK ACTIONS
      ====================================================== */}

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>

          <p className="mt-1 text-sm text-slate-500">
            Quickly access important admin sections.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <QuickAction
            href="/admin/products"
            title="Manage Products"
            description="Add, edit and manage your product catalog."
            icon={<Package size={20} />}
          />

          <QuickAction
            href="/admin/orders"
            title="Manage Orders"
            description="Review orders and update their status."
            icon={<ShoppingBag size={20} />}
          />

          <QuickAction
            href="/admin/users"
            title="Manage Users"
            description="View and manage customer accounts."
            icon={<Users size={20} />}
          />

          <QuickAction
            href="/admin/settings"
            title="Admin Settings"
            description="Manage your administrator profile."
            icon={<ShieldCheck size={20} />}
          />
        </div>
      </section>
    </div>
  );
}

// ============================================================
// STAT CARD
// ============================================================

function StatCard({
  title,
  value,
  icon,
  iconClass,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconClass: string;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// QUICK ACTION
// ============================================================

function QuickAction({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>

        <ArrowRight
          size={17}
          className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
        />
      </div>

      <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>

      <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
    </Link>
  );
}
