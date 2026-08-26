"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  User,
  Mail,
  ShieldCheck,
  Package,
  LayoutDashboard,
  LogOut,
  Loader2,
  ShoppingBag,
  ArrowRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { toast } from "react-hot-toast";

// ============================================================
// TYPES
// ============================================================

type UserRole = "user" | "admin";

type UserData = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
};

// ============================================================
// ACCOUNT PAGE
// ============================================================

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState<UserData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [loggingOut, setLoggingOut] = useState(false);

  // ==========================================================
  // FETCH CURRENT USER
  // ==========================================================

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      let data: any = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      // ------------------------------------------------------
      // NOT AUTHENTICATED
      // ------------------------------------------------------

      if (response.status === 401 || response.status === 403) {
        router.replace(`/login?redirect=${encodeURIComponent("/account")}`);

        return;
      }

      // ------------------------------------------------------
      // API ERROR
      // ------------------------------------------------------

      if (!response.ok || !data?.success || !data?.user) {
        throw new Error(data?.message || "Unable to load account information.");
      }

      // ------------------------------------------------------
      // SUCCESS
      // ------------------------------------------------------

      setUser(data.user);
    } catch (error) {
      console.error("ACCOUNT FETCH ERROR:", error);

      const message =
        error instanceof Error ? error.message : "Unable to load account.";

      setError(message);

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [router]);

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = async () => {
    if (loggingOut) {
      return;
    }

    try {
      setLoggingOut(true);

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      let data: any = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(data?.message || "Unable to logout.");
      }

      toast.success("Logged out successfully.");

      // Clear local user state
      setUser(null);

      // Go to login
      router.replace("/login");

      // Refresh server components
      router.refresh();
    } catch (error) {
      console.error("LOGOUT ERROR:", error);

      toast.error(error instanceof Error ? error.message : "Unable to logout.");

      setLoggingOut(false);
    }
  };

  // ==========================================================
  // LOADING STATE
  // ==========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">
          <div className="flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              Loading your account
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Please wait a moment...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // ERROR STATE
  // ==========================================================

  if (error || !user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AlertCircle className="h-7 w-7" />
            </div>

            <h1 className="mt-5 text-xl font-bold text-slate-900">
              Unable to load account
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {error || "We couldn't load your account information."}
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={loadUser}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>

              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // ROUTES BASED ON ROLE
  // ==========================================================

  const dashboardHref = user.role === "admin" ? "/admin" : "/dashboard";

  const dashboardTitle =
    user.role === "admin" ? "Admin Dashboard" : "My Dashboard";

  const dashboardDescription =
    user.role === "admin"
      ? "Manage your store, orders, products and customers."
      : "View your account activity and personal information.";

  // ==========================================================
  // ACCOUNT PAGE
  // ==========================================================

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-indigo-600">
                My Account
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Welcome, {user.name}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage your profile, orders, shopping activity and account
                preferences from one place.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              {user.role === "admin" ? "Administrator" : "Customer"}
            </div>
          </div>
        </div>

        {/* ====================================================
            MAIN GRID
        ==================================================== */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ==================================================
              PROFILE CARD
          ================================================== */}

          <div className="lg:col-span-1">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              {/* PROFILE HEADER */}

              <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-700 px-6 py-8 text-white">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur">
                  <User className="h-8 w-8" />
                </div>

                <h2 className="mt-5 text-xl font-bold">{user.name}</h2>

                <p className="mt-1 text-sm text-blue-100">
                  {user.role === "admin" ? "Administrator" : "Customer"}
                </p>
              </div>

              {/* PROFILE DETAILS */}

              <div className="space-y-5 p-6">
                {/* EMAIL */}

                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                    <Mail className="h-5 w-5 text-slate-500" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Email
                    </p>

                    <p className="mt-1 break-all text-sm font-medium text-slate-800">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* ROLE */}

                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                    <ShieldCheck className="h-5 w-5 text-slate-500" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Account Type
                    </p>

                    <p className="mt-1 text-sm font-semibold capitalize text-slate-800">
                      {user.role}
                    </p>
                  </div>
                </div>

                {/* LOGOUT */}

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loggingOut ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4" />
                      Logout
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ==================================================
              ACTIONS
          ================================================== */}

          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* DASHBOARD */}

              <AccountAction
                href={dashboardHref}
                title={dashboardTitle}
                description={dashboardDescription}
                icon={<LayoutDashboard className="h-6 w-6" />}
                iconClass="bg-indigo-50 text-indigo-600"
              />

              {/* ORDERS */}

              <AccountAction
                href="/orders"
                title="My Orders"
                description="View your orders, payment details and delivery status."
                icon={<ShoppingBag className="h-6 w-6" />}
                iconClass="bg-emerald-50 text-emerald-600"
              />

              {/* PRODUCTS */}

              <AccountAction
                href="/products"
                title="Explore Products"
                description="Browse products and discover something new."
                icon={<Package className="h-6 w-6" />}
                iconClass="bg-orange-50 text-orange-600"
              />

              {/* CART */}

              <AccountAction
                href="/cart"
                title="Shopping Cart"
                description="Review your cart and continue to checkout."
                icon={<ShoppingBag className="h-6 w-6" />}
                iconClass="bg-purple-50 text-purple-600"
              />
            </div>

            {/* =================================================
                ADMIN AREA
            ================================================= */}

            {user.role === "admin" && (
              <div className="mt-6 overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
                <div className="p-6">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                      <ShieldCheck className="h-6 w-6" />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-amber-950">
                        Administrator Access
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-amber-800">
                        You have administrator privileges. Manage your
                        e-commerce store from the admin panel.
                      </p>
                    </div>

                    <Link
                      href="/admin"
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
                    >
                      Open Admin Panel
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ACCOUNT ACTION COMPONENT
// ============================================================

function AccountAction({
  href,
  title,
  description,
  icon,
  iconClass,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconClass: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

        <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600" />
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>

      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600">
        Open
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
