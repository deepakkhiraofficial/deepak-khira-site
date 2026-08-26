"use client";

import { FormEvent, useState } from "react";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Loader2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { toast } from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  // ============================================================
  // LOGIN
  // ============================================================

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      toast.error("Please enter your admin email.");

      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      toast.error("Please enter a valid email address.");

      return;
    }

    if (!password) {
      toast.error("Please enter your password.");

      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/admin/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        cache: "no-store",

        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      let data: {
        success?: boolean;
        message?: string;
      };

      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid server response.");
      }

      if (response.status === 401) {
        throw new Error(data.message || "Invalid admin email or password.");
      }

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Unable to login.");
      }

      toast.success("Admin login successful.");

      /*
       * Give the browser a moment to
       * store the authentication cookie.
       */

      await new Promise((resolve) => setTimeout(resolve, 250));

      router.replace("/admin");

      router.refresh();
    } catch (error: unknown) {
      console.error("ADMIN LOGIN ERROR:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* ========================================================
          BACKGROUND
      ======================================================== */}

      <div className="absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="absolute -bottom-40 -right-32 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      {/* ========================================================
          CONTENT
      ======================================================== */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl">
          <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/40 backdrop-blur-xl lg:grid-cols-2">
            {/* ==================================================
                BRAND PANEL
            ================================================== */}

            <div className="hidden flex-col justify-between bg-gradient-to-br from-blue-600 via-indigo-700 to-violet-800 p-10 lg:flex">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20 backdrop-blur">
                    <ShieldCheck size={23} />
                  </div>

                  <div>
                    <p className="text-lg font-bold text-white">KHIRA</p>

                    <p className="text-xs text-blue-100">ENTERPRISES</p>
                  </div>
                </div>

                <div className="mt-16">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">
                    Administration
                  </p>

                  <h1 className="mt-4 text-4xl font-bold leading-tight text-white">
                    Manage your
                    <br />
                    business
                    <br />
                    with confidence.
                  </h1>

                  <p className="mt-6 max-w-md text-sm leading-6 text-blue-100">
                    Access your e-commerce administration panel to manage
                    products, orders, customers and inventory.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  "Product & inventory management",
                  "Order processing & tracking",
                  "Customer management",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-white"
                  >
                    <CheckCircle2 size={17} className="text-blue-200" />

                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* ==================================================
                LOGIN PANEL
            ================================================== */}

            <div className="bg-white p-6 sm:p-10 lg:p-12">
              {/* MOBILE BRAND */}

              <div className="mb-8 flex items-center gap-3 lg:hidden">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                  <ShieldCheck size={22} />
                </div>

                <div>
                  <p className="font-bold text-slate-900">KHIRA ENTERPRISES</p>

                  <p className="text-xs text-slate-500">Admin Panel</p>
                </div>
              </div>

              {/* HEADER */}

              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <LockKeyhole size={22} />
                </div>

                <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Sign in to access your administrator dashboard.
                </p>
              </div>

              {/* FORM */}

              <form onSubmit={submit} className="mt-8 space-y-5">
                {/* EMAIL */}

                <div>
                  <label
                    htmlFor="admin-email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Admin Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="admin-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="admin@example.com"
                      autoComplete="email"
                      autoFocus
                      disabled={loading}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* PASSWORD */}

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="admin-password"
                      className="block text-sm font-semibold text-slate-700"
                    >
                      Password
                    </label>
                  </div>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={loading}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* SECURITY MESSAGE */}

                <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />

                  <p className="text-xs leading-5 text-slate-500">
                    This is a secure administrator area. Only authorized users
                    should continue.
                  </p>
                </div>

                {/* LOGIN BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-blue-600/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in to Admin
                      <ArrowRight
                        size={18}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* FOOTER */}

              <div className="mt-8 border-t border-slate-100 pt-5 text-center">
                <p className="text-xs text-slate-400">
                  Authorized administrator access only
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
