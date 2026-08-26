"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
    Users,
    ShieldCheck,
    UserRound,
    Search,
    RefreshCw,
    Mail,
    CalendarDays,
    X,
} from "lucide-react";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    // ============================================================
    // FETCH USERS
    // ============================================================

    const fetchUsers = useCallback(
        async (showRefresh = false) => {
            try {
                if (showRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError("");

                const response =
                    await fetch(
                        "/api/admin/users",
                        {
                            method: "GET",
                            credentials:
                                "include",
                            cache: "no-store",
                        }
                    );

                let data;

                try {
                    data =
                        await response.json();
                } catch {
                    throw new Error(
                        "Invalid server response."
                    );
                }

                if (
                    response.status === 401
                ) {
                    throw new Error(
                        "Admin session expired. Please login again."
                    );
                }

                if (
                    !response.ok ||
                    !data.success
                ) {
                    throw new Error(
                        data.message ||
                        "Unable to load users."
                    );
                }

                setUsers(
                    Array.isArray(
                        data.users
                    )
                        ? data.users
                        : []
                );
            } catch (error) {
                console.error(
                    "ADMIN USERS ERROR:",
                    error
                );

                setError(
                    error instanceof Error
                        ? error.message
                        : "Unable to load users."
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        []
    );

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // ============================================================
    // SEARCH
    // ============================================================

    const filteredUsers =
        useMemo(() => {
            const query =
                search
                    .trim()
                    .toLowerCase();

            if (!query) {
                return users;
            }

            return users.filter(
                (user) => {
                    const name =
                        String(
                            user?.name ||
                            ""
                        ).toLowerCase();

                    const email =
                        String(
                            user?.email ||
                            ""
                        ).toLowerCase();

                    const role =
                        String(
                            user?.role ||
                            ""
                        ).toLowerCase();

                    return (
                        name.includes(
                            query
                        ) ||
                        email.includes(
                            query
                        ) ||
                        role.includes(
                            query
                        )
                    );
                }
            );
        }, [users, search]);

    // ============================================================
    // STATS
    // ============================================================

    const totalUsers =
        users.length;

    const adminUsers =
        users.filter(
            (user) =>
                user?.role === "admin"
        ).length;

    const normalUsers =
        users.filter(
            (user) =>
                user?.role === "user"
        ).length;

    // ============================================================
    // DATE
    // ============================================================

    const formatDate = (
        value
    ) => {
        if (!value) {
            return "—";
        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "—";
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <div className="space-y-8">

                <div>
                    <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />

                    <div className="mt-3 h-9 w-40 animate-pulse rounded-lg bg-slate-200" />

                    <div className="mt-2 h-4 w-80 animate-pulse rounded bg-slate-100" />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                    {Array.from({
                        length: 3,
                    }).map(
                        (_, index) => (
                            <div
                                key={
                                    index
                                }
                                className="h-28 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
                            />
                        )
                    )}

                </div>

                <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

                    <div className="h-14 animate-pulse bg-slate-50" />

                    {Array.from({
                        length: 6,
                    }).map(
                        (_, index) => (
                            <div
                                key={
                                    index
                                }
                                className="h-16 animate-pulse border-t border-slate-100"
                            />
                        )
                    )}

                </div>

            </div>
        );
    }

    // ============================================================
    // ERROR
    // ============================================================

    if (error) {
        return (
            <div className="space-y-6">

                <div>
                    <p className="text-sm font-medium text-blue-600">
                        User Management
                    </p>

                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                        Users
                    </h1>
                </div>

                <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

                    <h2 className="font-semibold text-red-900">
                        Unable to load users
                    </h2>

                    <p className="mt-1 text-sm text-red-700">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            fetchUsers()
                        }
                        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }

    // ============================================================
    // PAGE
    // ============================================================

    return (
        <div className="space-y-8">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                <div>

                    <p className="text-sm font-semibold text-blue-600">
                        User Management
                    </p>

                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                        Users
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Manage customers and administrator accounts.
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() =>
                        fetchUsers(
                            true
                        )
                    }
                    disabled={
                        refreshing
                    }
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <RefreshCw
                        size={16}
                        className={
                            refreshing
                                ? "animate-spin"
                                : ""
                        }
                    />

                    {refreshing
                        ? "Refreshing..."
                        : "Refresh"}
                </button>

            </div>

            {/* ==================================================
                STATS
            ================================================== */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                {/* Total */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Total Users
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {totalUsers.toLocaleString(
                                    "en-IN"
                                )}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Users
                                size={21}
                            />
                        </div>

                    </div>

                </div>

                {/* Customers */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Customers
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {normalUsers.toLocaleString(
                                    "en-IN"
                                )}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <UserRound
                                size={21}
                            />
                        </div>

                    </div>

                </div>

                {/* Admins */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Administrators
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {adminUsers.toLocaleString(
                                    "en-IN"
                                )}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                            <ShieldCheck
                                size={21}
                            />
                        </div>

                    </div>

                </div>

            </div>

            {/* ==================================================
                SEARCH
            ================================================== */}

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                <div className="relative">

                    <Search
                        size={18}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target
                                    .value
                            )
                        }
                        placeholder="Search by name, email or role..."
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={() =>
                                setSearch(
                                    ""
                                )
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                            aria-label="Clear search"
                        >
                            <X
                                size={17}
                            />
                        </button>
                    )}

                </div>

                <div className="mt-3 flex items-center justify-between">

                    <p className="text-xs text-slate-500">
                        Showing{" "}
                        <span className="font-semibold text-slate-700">
                            {
                                filteredUsers.length
                            }
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-slate-700">
                            {
                                users.length
                            }
                        </span>{" "}
                        users
                    </p>

                    {search && (
                        <p className="text-xs text-blue-600">
                            Filter active
                        </p>
                    )}

                </div>

            </div>

            {/* ==================================================
                DESKTOP TABLE
            ================================================== */}

            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[850px]">

                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50">

                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                    User
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Contact
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Role
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Joined
                                </th>

                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">

                            {filteredUsers.map(
                                (user) => {
                                    const isAdmin =
                                        user?.role ===
                                        "admin";

                                    const initial =
                                        String(
                                            user?.name ||
                                            "U"
                                        )
                                            .charAt(
                                                0
                                            )
                                            .toUpperCase();

                                    return (
                                        <tr
                                            key={
                                                user._id
                                            }
                                            className="group transition hover:bg-slate-50"
                                        >

                                            {/* USER */}

                                            <td className="px-6 py-4">

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
                                                        {
                                                            initial
                                                        }
                                                    </div>

                                                    <div className="min-w-0">

                                                        <p className="truncate font-semibold text-slate-900">
                                                            {user?.name ||
                                                                "Unnamed User"}
                                                        </p>

                                                        <p className="mt-0.5 text-xs text-slate-400">
                                                            ID:{" "}
                                                            {String(
                                                                user?._id ||
                                                                ""
                                                            ).slice(
                                                                -8
                                                            )}
                                                        </p>

                                                    </div>

                                                </div>

                                            </td>

                                            {/* CONTACT */}

                                            <td className="px-6 py-4">

                                                <div className="flex items-center gap-2 text-sm text-slate-600">

                                                    <Mail
                                                        size={
                                                            15
                                                        }
                                                        className="text-slate-400"
                                                    />

                                                    <span>
                                                        {user?.email ||
                                                            "—"}
                                                    </span>

                                                </div>

                                            </td>

                                            {/* ROLE */}

                                            <td className="px-6 py-4">

                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${isAdmin
                                                            ? "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20"
                                                            : "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                                                        }`}
                                                >

                                                    {isAdmin ? (
                                                        <ShieldCheck
                                                            size={
                                                                13
                                                            }
                                                        />
                                                    ) : (
                                                        <UserRound
                                                            size={
                                                                13
                                                            }
                                                        />
                                                    )}

                                                    {isAdmin
                                                        ? "Administrator"
                                                        : "Customer"}

                                                </span>

                                            </td>

                                            {/* JOINED */}

                                            <td className="px-6 py-4">

                                                <div className="flex items-center gap-2 text-sm text-slate-500">

                                                    <CalendarDays
                                                        size={
                                                            15
                                                        }
                                                        className="text-slate-400"
                                                    />

                                                    {formatDate(
                                                        user?.createdAt
                                                    )}

                                                </div>

                                            </td>

                                        </tr>
                                    );
                                }
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* ==================================================
                MOBILE CARDS
            ================================================== */}

            <div className="space-y-3 lg:hidden">

                {filteredUsers.map(
                    (user) => {
                        const isAdmin =
                            user?.role ===
                            "admin";

                        const initial =
                            String(
                                user?.name ||
                                "U"
                            )
                                .charAt(
                                    0
                                )
                                .toUpperCase();

                        return (
                            <div
                                key={
                                    user._id
                                }
                                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                            >

                                <div className="flex items-start gap-3">

                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white">
                                        {
                                            initial
                                        }
                                    </div>

                                    <div className="min-w-0 flex-1">

                                        <div className="flex items-start justify-between gap-3">

                                            <div className="min-w-0">

                                                <p className="truncate font-semibold text-slate-900">
                                                    {user?.name ||
                                                        "Unnamed User"}
                                                </p>

                                                <p className="mt-1 truncate text-sm text-slate-500">
                                                    {user?.email ||
                                                        "—"}
                                                </p>

                                            </div>

                                            <span
                                                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${isAdmin
                                                        ? "bg-purple-50 text-purple-700"
                                                        : "bg-emerald-50 text-emerald-700"
                                                    }`}
                                            >
                                                {isAdmin
                                                    ? "Admin"
                                                    : "Customer"}
                                            </span>

                                        </div>

                                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">

                                            <CalendarDays
                                                size={
                                                    14
                                                }
                                            />

                                            Joined{" "}
                                            {formatDate(
                                                user?.createdAt
                                            )}

                                        </div>

                                    </div>

                                </div>

                            </div>
                        );
                    }
                )}

            </div>

            {/* ==================================================
                EMPTY STATE
            ================================================== */}

            {filteredUsers.length ===
                0 && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                            <Users
                                size={24}
                            />
                        </div>

                        <h3 className="mt-4 font-semibold text-slate-900">
                            No users found
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            {search
                                ? "Try a different name, email or role."
                                : "No users are available yet."}
                        </p>

                        {search && (
                            <button
                                type="button"
                                onClick={() =>
                                    setSearch(
                                        ""
                                    )
                                }
                                className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
                            >
                                Clear search
                            </button>
                        )}

                    </div>
                )}

        </div>
    );
}