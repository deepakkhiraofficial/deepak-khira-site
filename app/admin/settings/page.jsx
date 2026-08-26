"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    User,
    Mail,
    ShieldCheck,
    Save,
    RefreshCw,
    Lock,
    CheckCircle2,
    AlertCircle,
    RotateCcw,
} from "lucide-react";

import { toast } from "react-toastify";

export default function AdminSettingsPage() {
    const [adminData, setAdminData] =
        useState({
            name: "",
            email: "",
        });

    const [originalData, setOriginalData] =
        useState({
            name: "",
            email: "",
        });

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    // ============================================================
    // FETCH ADMIN PROFILE
    // ============================================================

    const fetchAdminData =
        useCallback(
            async (
                showRefresh = false
            ) => {
                try {
                    if (showRefresh) {
                        setRefreshing(
                            true
                        );
                    } else {
                        setLoading(true);
                    }

                    setError("");

                    const response =
                        await fetch(
                            "/api/admin/me",
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
                        response.status ===
                        401
                    ) {
                        throw new Error(
                            "Admin session expired. Please login again."
                        );
                    }

                    if (
                        !response.ok
                    ) {
                        throw new Error(
                            data?.message ||
                            "Unable to load admin profile."
                        );
                    }

                    /*
                     * Supports common API response shapes:
                     *
                     * { name, email }
                     * { user: { name, email } }
                     * { data: { name, email } }
                     */

                    const user =
                        data?.user ||
                        data?.data?.user ||
                        data?.data ||
                        data;

                    const profile = {
                        name:
                            user?.name ||
                            "",
                        email:
                            user?.email ||
                            "",
                    };

                    setAdminData(
                        profile
                    );

                    setOriginalData(
                        profile
                    );
                } catch (error) {
                    console.error(
                        "ADMIN PROFILE ERROR:",
                        error
                    );

                    const message =
                        error instanceof
                            Error
                            ? error.message
                            : "Unable to load admin profile.";

                    setError(
                        message
                    );

                    toast.error(
                        message
                    );
                } finally {
                    setLoading(false);
                    setRefreshing(
                        false
                    );
                }
            },
            []
        );

    useEffect(() => {
        fetchAdminData();
    }, [fetchAdminData]);

    // ============================================================
    // FORM CHANGED?
    // ============================================================

    const hasChanges =
        useMemo(() => {
            return (
                adminData.name.trim() !==
                originalData.name.trim() ||
                adminData.email.trim() !==
                originalData.email.trim()
            );
        }, [
            adminData,
            originalData,
        ]);

    // ============================================================
    // AVATAR INITIAL
    // ============================================================

    const initial =
        adminData.name
            ?.trim()
            ?.charAt(0)
            ?.toUpperCase() || "A";

    // ============================================================
    // UPDATE FIELD
    // ============================================================

    const updateField = (
        field,
        value
    ) => {
        setAdminData(
            (previous) => ({
                ...previous,
                [field]: value,
            })
        );

        if (error) {
            setError("");
        }
    };

    // ============================================================
    // RESET FORM
    // ============================================================

    const handleReset = () => {
        setAdminData(
            originalData
        );

        setError("");

        toast.info(
            "Changes discarded."
        );
    };

    // ============================================================
    // VALIDATION
    // ============================================================

    const validateForm = () => {
        const name =
            adminData.name.trim();

        const email =
            adminData.email
                .trim()
                .toLowerCase();

        if (!name) {
            toast.error(
                "Admin name is required."
            );

            return false;
        }

        if (name.length < 2) {
            toast.error(
                "Name must contain at least 2 characters."
            );

            return false;
        }

        if (name.length > 100) {
            toast.error(
                "Name cannot exceed 100 characters."
            );

            return false;
        }

        if (!email) {
            toast.error(
                "Email address is required."
            );

            return false;
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            !emailRegex.test(email)
        ) {
            toast.error(
                "Please enter a valid email address."
            );

            return false;
        }

        return true;
    };

    // ============================================================
    // SAVE SETTINGS
    // ============================================================

    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        if (saving) {
            return;
        }

        if (!validateForm()) {
            return;
        }

        if (!hasChanges) {
            toast.info(
                "No changes to save."
            );

            return;
        }

        try {
            setSaving(true);
            setError("");

            const payload = {
                name: adminData.name.trim(),
                email: adminData.email
                    .trim()
                    .toLowerCase(),
            };

            const response =
                await fetch(
                    "/api/admin/settings",
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        credentials:
                            "include",

                        cache: "no-store",

                        body: JSON.stringify(
                            payload
                        ),
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
                response.status ===
                401
            ) {
                throw new Error(
                    "Admin session expired. Please login again."
                );
            }

            if (
                !response.ok ||
                data?.success === false
            ) {
                throw new Error(
                    data?.message ||
                    "Unable to update settings."
                );
            }

            /*
             * Use server-returned user
             * when available.
             */

            const updatedUser =
                data?.user ||
                data?.data?.user ||
                data?.data;

            const updatedProfile = {
                name:
                    updatedUser?.name ||
                    payload.name,

                email:
                    updatedUser?.email ||
                    payload.email,
            };

            setAdminData(
                updatedProfile
            );

            setOriginalData(
                updatedProfile
            );

            toast.success(
                "Admin profile updated successfully."
            );
        } catch (error) {
            console.error(
                "ADMIN SETTINGS UPDATE ERROR:",
                error
            );

            const message =
                error instanceof
                    Error
                    ? error.message
                    : "Unable to update settings.";

            setError(message);

            toast.error(
                message
            );
        } finally {
            setSaving(false);
        }
    };

    // ============================================================
    // LOADING STATE
    // ============================================================

    if (loading) {
        return (
            <div className="space-y-8">

                <div>
                    <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />

                    <div className="mt-3 h-9 w-56 animate-pulse rounded-lg bg-slate-200" />

                    <div className="mt-2 h-4 w-80 animate-pulse rounded bg-slate-100" />
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_1fr]">

                    <div className="h-72 animate-pulse rounded-2xl bg-white ring-1 ring-slate-200" />

                    <div className="h-[430px] animate-pulse rounded-2xl bg-white ring-1 ring-slate-200" />

                </div>

            </div>
        );
    }

    // ============================================================
    // PAGE
    // ============================================================

    return (
        <div className="mx-auto max-w-6xl space-y-8">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                <div>

                    <p className="text-sm font-semibold text-blue-600">
                        Administration
                    </p>

                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                        Admin Settings
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm text-slate-500">
                        Manage your administrator
                        profile and account information.
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() =>
                        fetchAdminData(
                            true
                        )
                    }
                    disabled={
                        refreshing ||
                        saving
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
                ERROR
            ================================================== */}

            {error && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">

                    <AlertCircle
                        size={19}
                        className="mt-0.5 shrink-0 text-red-600"
                    />

                    <div>
                        <p className="font-semibold text-red-900">
                            Something went wrong
                        </p>

                        <p className="mt-1 text-sm text-red-700">
                            {error}
                        </p>
                    </div>

                </div>
            )}

            {/* ==================================================
                MAIN GRID
            ================================================== */}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">

                {/* ==================================================
                    PROFILE CARD
                ================================================== */}

                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-100 p-6">

                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                            Administrator
                        </p>

                        <div className="mt-5 flex flex-col items-center text-center">

                            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-3xl font-bold text-white shadow-xl shadow-blue-600/20">
                                {initial}
                            </div>

                            <h2 className="mt-4 text-lg font-bold text-slate-900">
                                {adminData.name ||
                                    "Administrator"}
                            </h2>

                            <p className="mt-1 max-w-full truncate text-sm text-slate-500">
                                {adminData.email ||
                                    "No email"}
                            </p>

                            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Active Administrator
                            </span>

                        </div>

                    </div>

                    <div className="space-y-4 p-6">

                        <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                <ShieldCheck
                                    size={17}
                                />
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">
                                    Account Role
                                </p>

                                <p className="text-sm font-semibold text-slate-800">
                                    Administrator
                                </p>
                            </div>

                        </div>

                        <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                <CheckCircle2
                                    size={17}
                                />
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">
                                    Account Status
                                </p>

                                <p className="text-sm font-semibold text-slate-800">
                                    Active
                                </p>
                            </div>

                        </div>

                    </div>

                </section>

                {/* ==================================================
                    PROFILE FORM
                ================================================== */}

                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-100 px-6 py-5 sm:px-7">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <User
                                    size={19}
                                />
                            </div>

                            <div>
                                <h2 className="font-bold text-slate-900">
                                    Profile Information
                                </h2>

                                <p className="mt-0.5 text-xs text-slate-500">
                                    Update your administrator details.
                                </p>
                            </div>

                        </div>

                    </div>

                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >

                        <div className="space-y-6 p-6 sm:p-7">

                            {/* NAME */}

                            <div>

                                <label
                                    htmlFor="admin-name"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Full Name
                                </label>

                                <div className="relative">

                                    <User
                                        size={17}
                                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        id="admin-name"
                                        type="text"
                                        value={
                                            adminData.name
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            updateField(
                                                "name",
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="Enter your full name"
                                        autoComplete="name"
                                        maxLength={
                                            100
                                        }
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                    />

                                </div>

                                <p className="mt-1.5 text-xs text-slate-400">
                                    This name will be used
                                    throughout the admin panel.
                                </p>

                            </div>

                            {/* EMAIL */}

                            <div>

                                <label
                                    htmlFor="admin-email"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Email Address
                                </label>

                                <div className="relative">

                                    <Mail
                                        size={17}
                                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        id="admin-email"
                                        type="email"
                                        value={
                                            adminData.email
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            updateField(
                                                "email",
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="admin@example.com"
                                        autoComplete="email"
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                    />

                                </div>

                                <p className="mt-1.5 text-xs text-slate-400">
                                    Use an active email address
                                    that you can access.
                                </p>

                            </div>

                            {/* SECURITY INFO */}

                            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">

                                <div className="flex items-start gap-3">

                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                                        <Lock
                                            size={
                                                17
                                            }
                                        />
                                    </div>

                                    <div>

                                        <p className="text-sm font-semibold text-blue-900">
                                            Account Security
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-blue-700">
                                            Your password and
                                            authentication settings
                                            are managed separately.
                                            Updating your profile
                                            does not change your
                                            password.
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* ==================================================
                            ACTIONS
                        ================================================== */}

                        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">

                            <div className="text-xs text-slate-400">

                                {hasChanges ? (
                                    <span className="font-medium text-amber-600">
                                        You have unsaved changes.
                                    </span>
                                ) : (
                                    "Your profile is up to date."
                                )}

                            </div>

                            <div className="flex gap-2">

                                <button
                                    type="button"
                                    onClick={
                                        handleReset
                                    }
                                    disabled={
                                        !hasChanges ||
                                        saving
                                    }
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <RotateCcw
                                        size={
                                            15
                                        }
                                    />

                                    Reset
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        saving ||
                                        !hasChanges
                                    }
                                    className="inline-flex h-10 min-w-[150px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    {saving ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save
                                                size={
                                                    16
                                                }
                                            />

                                            Save Changes
                                        </>
                                    )}

                                </button>

                            </div>

                        </div>

                    </form>

                </section>

            </div>

        </div>
    );
}