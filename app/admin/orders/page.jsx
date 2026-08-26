"use client";

import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import OrdersTable from "@/components/admin/OrdersTable";
import { Button } from "@/components/ui/button";

const PAGE_LIMIT = 10;

const STATUS_OPTIONS = [
    { value: "", label: "All orders" },
    { value: "placed", label: "Placed" },
    { value: "confirmed", label: "Confirmed" },
    { value: "packed", label: "Packed" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
];

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);

    const [page, setPage] = useState(1);

    const [searchInput, setSearchInput] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [status, setStatus] =
        useState("");

    const [totalPages, setTotalPages] =
        useState(1);

    const [totalOrders, setTotalOrders] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const abortControllerRef =
        useRef(null);

    // ============================================================
    // SEARCH DEBOUNCE
    // ============================================================

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setPage(1);
            setSearch(searchInput.trim());
        }, 400);

        return () => {
            window.clearTimeout(timer);
        };
    }, [searchInput]);

    // ============================================================
    // LOAD ORDERS
    // ============================================================

    const loadOrders = useCallback(
        async (isRefresh = false) => {
            // Cancel previous request
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            const controller =
                new AbortController();

            abortControllerRef.current =
                controller;

            try {
                setError("");

                if (isRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                const params =
                    new URLSearchParams();

                params.set(
                    "search",
                    search
                );

                params.set(
                    "page",
                    String(page)
                );

                params.set(
                    "limit",
                    String(PAGE_LIMIT)
                );

                params.set(
                    "status",
                    status
                );

                const response =
                    await fetch(
                        `/api/admin/orders?${params.toString()}`,
                        {
                            method: "GET",
                            credentials: "include",
                            cache: "no-store",
                            signal:
                                controller.signal,
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

                // ====================================================
                // AUTH ERROR
                // ====================================================

                if (
                    response.status === 401
                ) {
                    throw new Error(
                        "Your admin session has expired. Please login again."
                    );
                }

                // ====================================================
                // API ERROR
                // ====================================================

                if (
                    !response.ok ||
                    !data.success
                ) {
                    throw new Error(
                        data.message ||
                        "Unable to load orders."
                    );
                }

                // ====================================================
                // SUCCESS
                // ====================================================

                setOrders(
                    Array.isArray(
                        data.orders
                    )
                        ? data.orders
                        : []
                );

                const pagination =
                    data.pagination || {};

                setTotalPages(
                    Math.max(
                        1,
                        pagination.totalPages || 1
                    )
                );

                setTotalOrders(
                    pagination.total || 0
                );
            } catch (err) {
                if (
                    err?.name ===
                    "AbortError"
                ) {
                    return;
                }

                console.error(
                    "Admin orders fetch error:",
                    err
                );

                setOrders([]);
                setTotalPages(1);
                setTotalOrders(0);

                setError(
                    err?.message ||
                    "Unable to load orders."
                );
            } finally {
                if (
                    !controller.signal.aborted
                ) {
                    setLoading(false);
                    setRefreshing(false);
                }
            }
        },
        [page, search, status]
    );

    // ============================================================
    // FETCH ORDERS
    // ============================================================

    useEffect(() => {
        loadOrders();

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [loadOrders]);

    // ============================================================
    // PAGE SAFETY
    // ============================================================

    useEffect(() => {
        if (
            page > totalPages &&
            totalPages > 0
        ) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    // ============================================================
    // PAGE NUMBERS
    // ============================================================

    const pageNumbers = useMemo(() => {
        const pages = [];

        const start = Math.max(
            1,
            page - 2
        );

        const end = Math.min(
            totalPages,
            page + 2
        );

        for (
            let current = start;
            current <= end;
            current++
        ) {
            pages.push(current);
        }

        return pages;
    }, [page, totalPages]);

    // ============================================================
    // CLEAR FILTERS
    // ============================================================

    const clearFilters = () => {
        setSearchInput("");
        setSearch("");
        setStatus("");
        setPage(1);
    };

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />

                        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-100" />
                    </div>

                    <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-100" />
                </div>

                <div className="rounded-2xl border bg-white p-4">
                    <div className="h-11 w-full animate-pulse rounded-xl bg-gray-100" />
                </div>

                <div className="overflow-hidden rounded-2xl border bg-white">
                    <div className="space-y-4 p-6">
                        {Array.from({
                            length: 6,
                        }).map((_, index) => (
                            <div
                                key={index}
                                className="h-12 animate-pulse rounded-lg bg-gray-100"
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // ============================================================
    // PAGE
    // ============================================================

    return (
        <div className="space-y-6">

            {/* HEADER */}

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>
                    <p className="text-sm font-medium text-blue-600">
                        Admin Management
                    </p>

                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
                        Orders
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Manage customer orders,
                        payments and order status.
                    </p>
                </div>

                <Button
                    type="button"
                    onClick={() =>
                        loadOrders(true)
                    }
                    disabled={refreshing}
                    className="w-full sm:w-auto"
                >
                    {refreshing
                        ? "Refreshing..."
                        : "Refresh"}
                </Button>
            </div>

            {/* ERROR */}

            {error && (
                <div className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <h2 className="font-semibold text-red-800">
                            Unable to load orders
                        </h2>

                        <p className="mt-1 text-sm text-red-600">
                            {error}
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            loadOrders(true)
                        }
                        disabled={refreshing}
                    >
                        Try Again
                    </Button>
                </div>
            )}

            {/* FILTERS */}

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

                    <div className="flex-1">
                        <input
                            value={searchInput}
                            onChange={(event) =>
                                setSearchInput(
                                    event.target.value
                                )
                            }
                            placeholder="Search orders..."
                            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <select
                        value={status}
                        onChange={(event) => {
                            setStatus(
                                event.target.value
                            );
                            setPage(1);
                        }}
                        className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    >
                        {STATUS_OPTIONS.map(
                            (option) => (
                                <option
                                    key={
                                        option.value
                                    }
                                    value={
                                        option.value
                                    }
                                >
                                    {option.label}
                                </option>
                            )
                        )}
                    </select>

                    {(search || status) && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={
                                clearFilters
                            }
                            className="h-11"
                        >
                            Clear
                        </Button>
                    )}
                </div>

                <div className="mt-3 flex flex-col gap-1 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">

                    <span>
                        {totalOrders.toLocaleString()}{" "}
                        {totalOrders === 1
                            ? "order"
                            : "orders"}{" "}
                        found
                    </span>

                    {search && (
                        <span>
                            Searching for "
                            <strong className="font-medium text-gray-700">
                                {search}
                            </strong>
                            "
                        </span>
                    )}
                </div>
            </div>

            {/* ORDERS */}

            {orders.length > 0 ? (
                <div className="relative">

                    {refreshing && (
                        <div className="absolute inset-x-0 top-0 z-10 h-1 overflow-hidden rounded-full bg-blue-100">
                            <div className="h-full w-1/3 animate-pulse rounded-full bg-blue-600" />
                        </div>
                    )}

                    <OrdersTable
                        orders={orders}
                        onReload={() =>
                            loadOrders(true)
                        }
                    />
                </div>
            ) : (
                <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">

                    <h2 className="text-lg font-semibold text-gray-900">
                        No orders found
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        {search || status
                            ? "Try changing your search or filters."
                            : "There are no customer orders yet."}
                    </p>

                    {(search || status) && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={
                                clearFilters
                            }
                            className="mt-5"
                        >
                            Clear Filters
                        </Button>
                    )}
                </div>
            )}

            {/* PAGINATION */}

            {totalPages > 1 && (
                <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

                    <p className="text-sm text-gray-500">
                        Page{" "}
                        <span className="font-medium text-gray-900">
                            {page}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium text-gray-900">
                            {totalPages}
                        </span>
                    </p>

                    <div className="flex items-center justify-center gap-2">

                        <button
                            type="button"
                            disabled={
                                page === 1 ||
                                refreshing
                            }
                            onClick={() =>
                                setPage(
                                    (current) =>
                                        Math.max(
                                            1,
                                            current - 1
                                        )
                                )
                            }
                            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Previous
                        </button>

                        {pageNumbers.map(
                            (pageNumber) => (
                                <button
                                    key={
                                        pageNumber
                                    }
                                    type="button"
                                    onClick={() =>
                                        setPage(
                                            pageNumber
                                        )
                                    }
                                    disabled={
                                        refreshing
                                    }
                                    className={`min-w-10 rounded-lg px-3 py-2 text-sm font-medium transition ${pageNumber ===
                                            page
                                            ? "bg-blue-600 text-white"
                                            : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                                        } disabled:cursor-not-allowed disabled:opacity-50`}
                                >
                                    {
                                        pageNumber
                                    }
                                </button>
                            )
                        )}

                        <button
                            type="button"
                            disabled={
                                page >=
                                totalPages ||
                                refreshing
                            }
                            onClick={() =>
                                setPage(
                                    (current) =>
                                        Math.min(
                                            totalPages,
                                            current + 1
                                        )
                                )
                            }
                            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}