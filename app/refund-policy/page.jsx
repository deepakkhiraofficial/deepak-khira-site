// import type { Metadata } from "next";
import {
    RefreshCcw,
    XCircle,
    CreditCard,
    AlertCircle,
    CheckCircle2,
    FileCheck2,
} from "lucide-react";

export const  Metadata = {
    title: "Refund & Cancellation Policy | Deepak Khira Enterprises",
    description:
        "Read the refund and cancellation policy of Deepak Khira Enterprises for products, digital services and service orders.",

    alternates: {
        canonical: "/refund-policy",
    },

    openGraph: {
        title: "Refund & Cancellation Policy | Deepak Khira Enterprises",
        description:
            "Learn about refund eligibility, duplicate payments and order cancellation terms at Deepak Khira Enterprises.",
        url: "https://deepak-khira-enterprises.in/refund-policy",
        siteName: "Deepak Khira Enterprises",
        type: "website",
    },
};

export default function RefundPolicy() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">

            {/* =========================================================
          HEADER
      ========================================================== */}

            <section className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
                <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-16">

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                            <RefreshCcw size={22} />
                        </div>

                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600 dark:text-blue-400">
                                Customer Information
                            </p>

                            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
                                Refund & Cancellation Policy
                            </h1>
                        </div>

                    </div>

                    <p className="mt-6 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-400">
                        We aim to provide the best products and services. Please
                        review the refund and cancellation terms below before
                        placing an order or requesting a service.
                    </p>

                </div>
            </section>

            {/* =========================================================
          QUICK SUMMARY
      ========================================================== */}

            <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                        {/* Refund */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/40">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                <RefreshCcw size={19} />
                            </div>

                            <h2 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                                Refund Terms
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Refunds are subject to the conditions described
                                in this policy.
                            </p>

                        </div>

                        {/* Cancellation */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/40">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                <XCircle size={19} />
                            </div>

                            <h2 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                                Cancellation
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Orders cannot be cancelled once they have been
                                processed.
                            </p>

                        </div>

                        {/* Payments */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/40">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                <CreditCard size={19} />
                            </div>

                            <h2 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                                Payment Issues
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Duplicate payments may qualify for a refund.
                            </p>

                        </div>

                    </div>

                </div>
            </section>

            {/* =========================================================
          POLICY CONTENT
      ========================================================== */}

            <section className="bg-white py-12 dark:bg-slate-950">
                <div className="mx-auto max-w-5xl px-5 sm:px-8">

                    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10 dark:border-slate-800 dark:bg-slate-900/30">

                        {/* ===================================================
                INTRODUCTION
            ==================================================== */}

                        <div>

                            <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                    <FileCheck2 size={18} />
                                </div>

                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    Policy Overview
                                </h2>

                            </div>

                            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
                                We aim to provide the best products and services.
                                Please review the following refund and cancellation
                                terms before making a purchase or placing a service
                                order.
                            </p>

                        </div>

                        <div className="my-8 h-px bg-slate-200 dark:bg-slate-800" />

                        {/* ===================================================
                1. REFUND POLICY
            ==================================================== */}

                        <section>

                            <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                    <RefreshCcw size={18} />
                                </div>

                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                    1. Refund Policy
                                </h2>

                            </div>

                            <div className="mt-5 space-y-3">

                                {/* Item 1 */}

                                <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">

                                    <CheckCircle2
                                        size={18}
                                        className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                                    />

                                    <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                                        No refunds after product download or service
                                        delivery.
                                    </p>

                                </div>

                                {/* Item 2 */}

                                <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">

                                    <CheckCircle2
                                        size={18}
                                        className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                                    />

                                    <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                                        Refunds may be approved only in case of
                                        duplicate payments.
                                    </p>

                                </div>

                                {/* Item 3 */}

                                <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">

                                    <CheckCircle2
                                        size={18}
                                        className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                                    />

                                    <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                                        Digital services are non-refundable.
                                    </p>

                                </div>

                            </div>

                        </section>

                        <div className="my-8 h-px bg-slate-200 dark:bg-slate-800" />

                        {/* ===================================================
                2. CANCELLATION POLICY
            ==================================================== */}

                        <section>

                            <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                    <XCircle size={18} />
                                </div>

                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                    2. Cancellation Policy
                                </h2>

                            </div>

                            <div className="mt-5 space-y-3">

                                {/* Item 1 */}

                                <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">

                                    <CheckCircle2
                                        size={18}
                                        className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                                    />

                                    <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                                        Orders cannot be cancelled once processed.
                                    </p>

                                </div>

                                {/* Item 2 */}

                                <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">

                                    <CheckCircle2
                                        size={18}
                                        className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                                    />

                                    <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                                        Custom service orders may involve a
                                        cancellation fee.
                                    </p>

                                </div>

                            </div>

                        </section>

                        {/* ===================================================
                IMPORTANT NOTE
            ==================================================== */}

                        <div className="mt-10 flex gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">

                            <AlertCircle
                                size={19}
                                className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
                            />

                            <div>

                                <p className="text-sm font-semibold text-amber-900 dark:text-amber-300">
                                    Important
                                </p>

                                <p className="mt-1 text-sm leading-6 text-amber-800/80 dark:text-amber-300/70">
                                    Please review the applicable refund and
                                    cancellation terms before placing an order or
                                    requesting a service.
                                </p>

                            </div>

                        </div>

                    </article>

                </div>
            </section>

        </div>
    );
}