"use client";

import { Bell, ChevronDown, LogOut, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const logout = async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            router.push("/admin/login");
            router.refresh();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <header className="sticky top-0 z-30 h-20 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                {/* ===================================================
            SEARCH
        =================================================== */}

                <div className="ml-12 flex min-w-0 flex-1 lg:ml-0">
                    <div className="hidden w-full max-w-md items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 sm:flex">
                        <Search
                            size={17}
                            className="shrink-0 text-slate-400"
                        />

                        <input
                            type="search"
                            placeholder="Search products, orders..."
                            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                        />
                    </div>

                    {/* Mobile title */}
                    <div className="sm:hidden">
                        <p className="text-sm font-semibold text-slate-900">
                            Admin
                        </p>

                        <p className="text-[11px] text-slate-400">
                            Management Panel
                        </p>
                    </div>
                </div>

                {/* ===================================================
            ACTIONS
        =================================================== */}

                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Notification */}
                    <button
                        type="button"
                        aria-label="Notifications"
                        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                    >
                        <Bell size={18} />

                        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-slate-900" />
                    </button>

                    {/* Divider */}
                    <div className="hidden h-8 w-px bg-slate-200 sm:block" />

                    {/* =================================================
              PROFILE
          ================================================= */}

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setProfileOpen((prev) => !prev)}
                            className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                                DK
                            </div>

                            <div className="hidden text-left md:block">
                                <p className="text-sm font-semibold text-slate-800">
                                    Deepak Khira
                                </p>

                                <p className="text-[11px] text-slate-400">
                                    Administrator
                                </p>
                            </div>

                            <ChevronDown
                                size={15}
                                className="hidden text-slate-400 md:block"
                            />
                        </button>

                        {/* Profile dropdown */}
                        {profileOpen && (
                            <div className="absolute right-0 top-12 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                                <div className="border-b border-slate-100 px-3 py-2.5">
                                    <p className="text-sm font-semibold text-slate-800">
                                        Deepak Khira
                                    </p>

                                    <p className="mt-0.5 text-xs text-slate-400">
                                        Administrator
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    disabled={loggingOut}
                                    onClick={logout}
                                    className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <LogOut size={16} />

                                    {loggingOut
                                        ? "Signing out..."
                                        : "Sign out"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}