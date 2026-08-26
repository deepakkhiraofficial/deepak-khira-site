"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineShoppingCart,
  HiOutlineUser,
  HiOutlineSearch,
  HiOutlineLogout,
  HiOutlineViewGrid,
  HiOutlineChevronDown,
} from "react-icons/hi";
import { Transition } from "@headlessui/react";
import { useCart } from "@/components/cart/CartContext";
import toast from "react-hot-toast";

type UserRole = "user" | "admin";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

type AuthResponse = {
  success: boolean;
  authenticated: boolean;
  user: AuthUser | null;
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // ==========================================================
  // CART
  // ==========================================================

  const { totalItems } = useCart();

  // ==========================================================
  // STATE
  // ==========================================================

  const [mobileOpen, setMobileOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);

  const searchRef = useRef<HTMLInputElement | null>(null);
  const previousCartCount = useRef(0);

  // ==========================================================
  // CART CHANGE ANIMATION
  // ==========================================================

  useEffect(() => {
    if (previousCartCount.current !== totalItems) {
      if (previousCartCount.current !== 0 || totalItems !== 0) {
        setCartPulse(true);

        const timer = window.setTimeout(() => {
          setCartPulse(false);
        }, 450);

        return () => window.clearTimeout(timer);
      }

      previousCartCount.current = totalItems;
    }

    previousCartCount.current = totalItems;
  }, [totalItems]);

  // ==========================================================
  // AUTHENTICATION
  // ==========================================================

  const checkAuth = useCallback(async () => {
    const controller = new AbortController();

    try {
      setAuthLoading(true);

      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        signal: controller.signal,
      });

      if (!response.ok) {
        setAuthUser(null);
        return;
      }

      const data: AuthResponse = await response.json();

      if (data.success && data.authenticated && data.user) {
        setAuthUser(data.user);
      } else {
        setAuthUser(null);
      }
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      console.error("AUTH CHECK ERROR:", error);
      setAuthUser(null);
    } finally {
      if (!controller.signal.aborted) {
        setAuthLoading(false);
      }
    }

    return () => controller.abort();
  }, []);

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (!active) return;
      await checkAuth();
    };

    run();

    return () => {
      active = false;
    };
  }, [checkAuth]);

  // Re-check authentication when browser tab becomes active.
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        checkAuth();
      }
    };

    window.addEventListener("focus", checkAuth);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("focus", checkAuth);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [checkAuth]);

  // ==========================================================
  // FETCH CATEGORIES
  // ==========================================================

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories", {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) return;

        const data = await response.json();

        if (data?.success && Array.isArray(data.categories)) {
          setCategories(
            data.categories.filter(
              (category: unknown): category is string =>
                typeof category === "string" && category.trim().length > 0
            )
          );
        }
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("CATEGORY FETCH ERROR:", error);
      }
    }

    fetchCategories();

    return () => controller.abort();
  }, []);

  // ==========================================================
  // ACTIVE LINK
  // ==========================================================

  const isActive = useCallback(
    (href: string) => {
      if (href === "/") {
        return pathname === "/";
      }

      return pathname === href || pathname?.startsWith(`${href}/`);
    },
    [pathname]
  );

  // ==========================================================
  // SEARCH
  // ==========================================================

  useEffect(() => {
    const value = search.trim();

    if (value.length < 2) {
      return;
    }

    const timer = window.setTimeout(() => {
      const params = new URLSearchParams();
      params.set("search", value);
      params.set("page", "1");

      router.replace(`/products?${params.toString()}`);
    }, 500);

    return () => window.clearTimeout(timer);
  }, [search, router]);

  // ==========================================================
  // ESCAPE KEY
  // ==========================================================

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setAccountOpen(false);
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, []);

  // ==========================================================
  // CLOSE MENUS ON ROUTE CHANGE
  // ==========================================================

  useEffect(() => {
    setMobileOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = useCallback(async () => {
    if (logoutLoading) return;

    try {
      setLogoutLoading(true);

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });

      const contentType = response.headers.get("content-type") || "";

      let data: { message?: string } = {};

      if (contentType.includes("application/json")) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data.message || "Logout failed.");
      }

      setAuthUser(null);
      setAccountOpen(false);
      setMobileOpen(false);

      toast.success("Logged out successfully.");

      router.replace("/");
      router.refresh();
    } catch (error: unknown) {
      console.error("LOGOUT ERROR:", error);

      toast.error(error instanceof Error ? error.message : "Unable to logout.");
    } finally {
      setLogoutLoading(false);
    }
  }, [logoutLoading, router]);

  // ==========================================================
  // ACCOUNT INITIAL
  // ==========================================================

  const userInitial = useMemo(() => {
    return authUser?.name?.trim()?.charAt(0)?.toUpperCase() || "U";
  }, [authUser]);

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* ==================================================
              LEFT
          ================================================== */}

          <div className="flex min-w-0 items-center gap-3">
            {/* MOBILE MENU */}

            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((value) => !value)}
              className="rounded-xl p-2 text-gray-700 transition hover:bg-gray-100 md:hidden"
            >
              {mobileOpen ? (
                <HiOutlineX size={23} />
              ) : (
                <HiOutlineMenu size={23} />
              )}
            </button>

            {/* LOGO */}

            <Link
              href="/"
              aria-label="Deepak Khira Enterprises home"
              className="flex shrink-0 items-center gap-2.5"
            >
              <Image
                src="/logo.png"
                alt="Deepak Khira Enterprises"
                width={42}
                height={42}
                priority
                className="rounded-xl object-contain"
              />

              <span className="hidden whitespace-nowrap text-base font-bold text-gray-900 sm:block lg:text-lg">
                Deepak Khira Enterprises
              </span>
            </Link>

            {/* DESKTOP NAV */}

            <nav className="ml-2 hidden items-center gap-1 lg:ml-4 md:flex">
              <Link
                href="/products"
                className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                  isActive("/products")
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                }`}
              >
                Products
              </Link>

              {/* CATEGORIES */}

              <div className="group relative">
                <button
                  type="button"
                  aria-haspopup="true"
                  className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-indigo-600"
                >
                  Categories
                  <HiOutlineChevronDown size={15} />
                </button>

                <div className="pointer-events-none invisible absolute left-0 top-full z-50 w-60 pt-2 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100">
                  <div className="rounded-2xl border border-gray-100 bg-white p-2 shadow-xl">
                    {categories.length === 0 ? (
                      <div className="px-3 py-4 text-center text-sm text-gray-500">
                        No categories available
                      </div>
                    ) : (
                      categories.map((category) => (
                        <Link
                          key={category}
                          href={`/products?categories=${encodeURIComponent(category)}`}
                          className="block rounded-xl px-3 py-2.5 text-sm text-gray-700 transition hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          {category}
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </nav>
          </div>

          {/* ==================================================
              SEARCH
          ================================================== */}

          <div className="hidden min-w-0 flex-1 px-3 md:block lg:px-5">
            <div className="relative mx-auto max-w-xl">
              <HiOutlineSearch
                size={19}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                ref={searchRef}
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products..."
                aria-label="Search products"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* ==================================================
              RIGHT
          ================================================== */}

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            {/* ACCOUNT */}

            {!authLoading && authUser ? (
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                  onClick={() => setAccountOpen((value) => !value)}
                  className="flex items-center gap-2 rounded-xl px-2.5 py-2 transition hover:bg-gray-100"
                >
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white"
                    aria-hidden="true"
                  >
                    {userInitial}
                  </div>

                  <div className="hidden max-w-[150px] text-left lg:block">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {authUser.name}
                    </p>

                    <p className="text-xs capitalize text-gray-500">
                      {authUser.role}
                    </p>
                  </div>

                  <HiOutlineChevronDown
                    size={15}
                    className={`text-gray-500 transition-transform ${
                      accountOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* ACCOUNT DROPDOWN */}

                <Transition
                  show={accountOpen}
                  enter="transition duration-150 ease-out"
                  enterFrom="opacity-0 scale-95 -translate-y-1"
                  enterTo="opacity-100 scale-100 translate-y-0"
                  leave="transition duration-100 ease-in"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <div
                    className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl"
                    role="menu"
                  >
                    <div className="border-b bg-gray-50 px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                          {userInitial}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-gray-900">
                            {authUser.name}
                          </p>

                          <p className="truncate text-xs text-gray-500">
                            {authUser.email}
                          </p>

                          <span className="mt-1 inline-block rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-indigo-700">
                            {authUser.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <Link
                        href={
                          authUser.role === "admin"
                            ? "/admin/dashboard"
                            : "/dashboard"
                        }
                        role="menuitem"
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <HiOutlineViewGrid size={19} />

                        {authUser.role === "admin"
                          ? "Admin Dashboard"
                          : "My Dashboard"}
                      </Link>

                      <Link
                        href="/account"
                        role="menuitem"
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                      >
                        <HiOutlineUser size={19} />
                        My Account
                      </Link>

                      <Link
                        href="/orders"
                        role="menuitem"
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                      >
                        <HiOutlineShoppingCart size={19} />
                        My Orders
                      </Link>

                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        disabled={logoutLoading}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <HiOutlineLogout size={19} />

                        {logoutLoading ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>
            ) : !authLoading ? (
              <Link
                href="/login"
                className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 sm:flex"
              >
                <HiOutlineUser size={19} />
                Login
              </Link>
            ) : (
              <div className="hidden h-9 w-20 animate-pulse rounded-xl bg-gray-100 sm:block" />
            )}

            {/* CART */}

            <Link
              href="/cart"
              aria-label={
                totalItems > 0
                  ? `Shopping cart with ${totalItems} items`
                  : "Shopping cart is empty"
              }
              className={`group relative flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-slate-100 ${
                cartPulse ? "scale-110" : "scale-100"
              }`}
            >
              <HiOutlineShoppingCart
                size={22}
                className={`transition ${
                  cartPulse
                    ? "text-indigo-600"
                    : "text-slate-700 group-hover:text-indigo-600"
                }`}
              />

              {totalItems > 0 && (
                <span
                  className={`absolute -right-1 -top-1 flex min-h-[20px] min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white shadow-sm ring-2 ring-white ${
                    cartPulse ? "animate-bounce" : ""
                  }`}
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* ====================================================
            MOBILE SEARCH
        ==================================================== */}

        {mobileOpen && (
          <div className="border-t border-gray-100 py-3 md:hidden">
            <div className="relative">
              <HiOutlineSearch
                size={19}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products..."
                aria-label="Search products"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
        )}
      </div>

      {/* ======================================================
          MOBILE MENU
      ====================================================== */}

      <Transition show={mobileOpen}>
        <div className="border-t border-gray-100 bg-white px-4 py-4 md:hidden">
          <div className="space-y-1">
            <Link
              href="/products"
              className={`block rounded-xl px-3 py-3 text-sm font-medium ${
                isActive("/products")
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Products
            </Link>

            <div className="px-3 pt-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Categories
            </div>

            {categories.map((category) => (
              <Link
                key={category}
                href={`/products?categories=${encodeURIComponent(category)}`}
                className="block rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                {category}
              </Link>
            ))}

            <div className="my-2 border-t" />

            {/* MOBILE AUTH */}

            {!authLoading && authUser && (
              <>
                <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                    {userInitial}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {authUser.name}
                    </p>

                    <p className="truncate text-xs text-gray-500">
                      {authUser.email}
                    </p>
                  </div>
                </div>

                <Link
                  href={
                    authUser.role === "admin"
                      ? "/admin/dashboard"
                      : "/dashboard"
                  }
                  className="block rounded-xl px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {authUser.role === "admin"
                    ? "Admin Dashboard"
                    : "My Dashboard"}
                </Link>

                <Link
                  href="/account"
                  className="block rounded-xl px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  My Account
                </Link>

                <Link
                  href="/orders"
                  className="block rounded-xl px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  My Orders
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <HiOutlineLogout size={19} />

                  {logoutLoading ? "Logging out..." : "Logout"}
                </button>
              </>
            )}

            {!authLoading && !authUser && (
              <>
                <Link
                  href="/login"
                  className="block rounded-xl px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="block rounded-xl bg-indigo-600 px-3 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Create Account
                </Link>
              </>
            )}

            {/* MOBILE CART */}

            <Link
              href="/cart"
              className="mt-2 flex items-center justify-between rounded-xl border border-gray-200 px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <span className="flex items-center gap-3">
                <HiOutlineShoppingCart size={20} />
                Shopping Cart
              </span>

              <span
                className={`rounded-full px-2 py-1 text-xs font-bold ${
                  totalItems > 0
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            </Link>
          </div>
        </div>
      </Transition>
    </header>
  );
}
