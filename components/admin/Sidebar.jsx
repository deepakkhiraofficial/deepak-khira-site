"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
    LayoutDashboard,
    Users,
    Package,
    ShoppingBag,
    Settings,
    Menu,
    X,
    LogOut,
    ChevronRight,
    Store,
    ExternalLink,
    ShieldCheck,
} from "lucide-react";

const links = [
    {
        href: "/admin",
        label: "Dashboard",
        description: "Overview & analytics",
        icon: LayoutDashboard,
    },
    {
        href: "/admin/users",
        label: "Users",
        description: "Manage customers",
        icon: Users,
    },
    {
        href: "/admin/products",
        label: "Products",
        description: "Manage catalogue",
        icon: Package,
    },
    {
        href: "/admin/orders",
        label: "Orders",
        description: "Manage purchases",
        icon: ShoppingBag,
    },
    {
        href: "/admin/settings",
        label: "Settings",
        description: "Store configuration",
        icon: Settings,
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    const [mobileOpen, setMobileOpen] =
        useState(false);

    const [loggingOut, setLoggingOut] =
        useState(false);

    // ============================================================
    // ACTIVE LINK
    // ============================================================

    const isActive = (href) => {
        if (
            href ===
            "/admin"
        ) {
            return pathname === href;
        }

        return (
            pathname === href ||
            pathname.startsWith(
                `${href}/`
            )
        );
    };

    // ============================================================
    // CLOSE MOBILE
    // ============================================================

    const closeMobile = () => {
        setMobileOpen(false);
    };

    // ============================================================
    // LOGOUT
    // ============================================================

    const handleLogout = async () => {
        if (loggingOut) return;

        try {
            setLoggingOut(true);

            await fetch(
                "/api/auth/logout",
                {
                    method: "POST",
                    credentials:
                        "include",
                }
            );
        } catch (error) {
            console.error(
                "Logout failed:",
                error
            );
        } finally {
            window.location.href =
                "/admin/login";
        }
    };

    return (
        <>
            {/* ====================================================
                MOBILE HEADER
            ==================================================== */}

            <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur lg:hidden">

                <Link
                    href="/admin"
                    onClick={closeMobile}
                    className="flex items-center gap-3"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20">
                        <Store
                            size={20}
                            strokeWidth={2.2}
                        />
                    </div>

                    <div className="leading-tight">
                        <p className="text-sm font-bold tracking-tight text-slate-900">
                            DEEPAK KHIRA
                        </p>

                        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                            Admin Panel
                        </p>
                    </div>
                </Link>

                <button
                    type="button"
                    onClick={() =>
                        setMobileOpen(
                            (value) =>
                                !value
                        )
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 active:scale-95"
                    aria-label="Toggle admin navigation"
                    aria-expanded={
                        mobileOpen
                    }
                >
                    {mobileOpen ? (
                        <X size={21} />
                    ) : (
                        <Menu size={21} />
                    )}
                </button>
            </header>

            {/* ====================================================
                MOBILE OVERLAY
            ==================================================== */}

            {mobileOpen && (
                <button
                    type="button"
                    aria-label="Close navigation"
                    onClick={closeMobile}
                    className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px] lg:hidden"
                />
            )}

            {/* ====================================================
                SIDEBAR
            ==================================================== */}

            <aside
                className={`
                    fixed left-0 top-0 z-50
                    flex h-screen w-[270px]
                    flex-col
                    border-r border-slate-800
                    bg-slate-950 text-white
                    shadow-2xl shadow-slate-950/20
                    transition-transform duration-300 ease-out
                    lg:translate-x-0

                    ${mobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }
                `}
            >

                {/* ==================================================
                    BRAND
                ================================================== */}

                <div className="flex h-[76px] shrink-0 items-center border-b border-white/[0.07] px-5">

                    <Link
                        href="/admin/dashboard"
                        onClick={
                            closeMobile
                        }
                        className="flex min-w-0 items-center gap-3"
                    >
                        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20">

                            <Store
                                size={22}
                                strokeWidth={
                                    2.2
                                }
                            />

                            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-950 bg-emerald-400" />
                        </div>

                        <div className="min-w-0">
                            <h1 className="truncate text-sm font-bold tracking-wide text-white">
                                DEEPAK KHIRA
                            </h1>

                            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
                                Enterprises
                            </p>
                        </div>
                    </Link>

                    <button
                        type="button"
                        onClick={
                            closeMobile
                        }
                        className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/[0.06] hover:text-white lg:hidden"
                        aria-label="Close navigation"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* ==================================================
                    ADMIN PROFILE
                ================================================== */}

                <div className="mx-3 mt-4 rounded-2xl border border-white/[0.07] bg-white/[0.035] p-3">

                    <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600/15 text-blue-400">
                            <ShieldCheck
                                size={18}
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-slate-200">
                                Administrator
                            </p>

                            <div className="mt-1 flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                                <span className="text-[10px] text-slate-500">
                                    Online
                                </span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ==================================================
                    NAVIGATION
                ================================================== */}

                <div className="flex-1 overflow-y-auto px-3 py-6">

                    <div className="mb-3 flex items-center justify-between px-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                            Management
                        </p>
                    </div>

                    <nav className="space-y-1.5">

                        {links.map(
                            ({
                                href,
                                label,
                                description,
                                icon: Icon,
                            }) => {
                                const active =
                                    isActive(
                                        href
                                    );

                                return (
                                    <Link
                                        key={
                                            href
                                        }
                                        href={
                                            href
                                        }
                                        onClick={
                                            closeMobile
                                        }
                                        className={`
                                            group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200

                                            ${active
                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                                : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                                            }
                                        `}
                                    >

                                        {/* Active indicator */}

                                        {active && (
                                            <span className="absolute bottom-2.5 left-0 h-6 w-0.5 rounded-r-full bg-white" />
                                        )}

                                        {/* Icon */}

                                        <div
                                            className={`
                                                flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors

                                                ${active
                                                    ? "bg-white/10 text-white"
                                                    : "bg-white/[0.025] text-slate-500 group-hover:bg-white/[0.07] group-hover:text-slate-200"
                                                }
                                            `}
                                        >
                                            <Icon
                                                size={
                                                    18
                                                }
                                                strokeWidth={
                                                    active
                                                        ? 2.2
                                                        : 1.9
                                                }
                                            />
                                        </div>

                                        {/* Label */}

                                        <div className="min-w-0 flex-1">
                                            <p
                                                className={`text-sm font-medium ${active
                                                        ? "text-white"
                                                        : "text-slate-300 group-hover:text-white"
                                                    }`}
                                            >
                                                {
                                                    label
                                                }
                                            </p>

                                            <p
                                                className={`mt-0.5 truncate text-[10px] ${active
                                                        ? "text-blue-100/70"
                                                        : "text-slate-600 group-hover:text-slate-500"
                                                    }`}
                                            >
                                                {
                                                    description
                                                }
                                            </p>
                                        </div>

                                        {/* Arrow */}

                                        <ChevronRight
                                            size={
                                                15
                                            }
                                            className={`
                                                shrink-0 transition-all

                                                ${active
                                                    ? "translate-x-0 text-blue-100"
                                                    : "-translate-x-1 text-slate-700 opacity-0 group-hover:translate-x-0 group-hover:text-slate-500 group-hover:opacity-100"
                                                }
                                            `}
                                        />

                                    </Link>
                                );
                            }
                        )}

                    </nav>
                </div>

                {/* ==================================================
                    BOTTOM AREA
                ================================================== */}

                <div className="shrink-0 border-t border-white/[0.07] p-3">

                    {/* View Store */}

                    <Link
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={
                            closeMobile
                        }
                        className="group mb-1.5 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.035] text-slate-500 transition group-hover:bg-white/[0.07] group-hover:text-white">
                            <Store
                                size={17}
                            />
                        </div>

                        <span className="flex-1">
                            View Website
                        </span>

                        <ExternalLink
                            size={14}
                            className="text-slate-600 transition group-hover:text-slate-400"
                        />
                    </Link>

                    {/* Logout */}

                    <button
                        type="button"
                        onClick={
                            handleLogout
                        }
                        disabled={
                            loggingOut
                        }
                        className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/[0.08] hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/[0.06] transition group-hover:bg-red-500/[0.12]">
                            {loggingOut ? (
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-300/30 border-t-red-300" />
                            ) : (
                                <LogOut
                                    size={
                                        17
                                    }
                                />
                            )}
                        </div>

                        <span>
                            {loggingOut
                                ? "Signing out..."
                                : "Logout"}
                        </span>
                    </button>

                    {/* Version */}

                    <p className="mt-3 text-center text-[9px] tracking-wide text-slate-700">
                        ADMIN PANEL • v1.0
                    </p>

                </div>
            </aside>
        </>
    );
}