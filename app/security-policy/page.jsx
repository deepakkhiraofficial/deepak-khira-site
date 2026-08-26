import type { Metadata } from "next";
import {
    ShieldCheck,
    AlertTriangle,
    Mail,
    Clock3,
    CheckCircle2,
    LockKeyhole,
} from "lucide-react";

export const metadata: Metadata = {
    title: "Security Policy | Deepak Khira Enterprises",
    description:
        "Learn about the security commitment of Deepak Khira Enterprises and how to responsibly report security vulnerabilities.",

    alternates: {
        canonical: "/security-policy",
    },

    openGraph: {
        title: "Security Policy | Deepak Khira Enterprises",
        description:
            "Our security commitment and responsible vulnerability disclosure guidelines.",
        url: "https://deepak-khira-enterprises.in/security-policy",
        siteName: "Deepak Khira Enterprises",
        type: "website",
    },
};

export default function SecurityPolicy() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">

            {/* =========================================================
          HEADER
      ========================================================== */}

            <section className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
                <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-16">

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                            <ShieldCheck size={22} />
                        </div>

                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600 dark:text-blue-400">
                                Security & Trust
                            </p>

                            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
                                Security Policy
                            </h1>
                        </div>

                    </div>

                    <p className="mt-6 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-400">
                        At Deepak Khira Enterprises, we take security seriously.
                        This policy explains how security issues can be reported
                        safely and responsibly.
                    </p>

                </div>
            </section>

            {/* =========================================================
          SECURITY OVERVIEW
      ========================================================== */}

            <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/40">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                <LockKeyhole size={19} />
                            </div>

                            <h2 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                                Security First
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                We take reported security concerns seriously and
                                review verified vulnerabilities.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/40">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                <Clock3 size={19} />
                            </div>

                            <h2 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                                Timely Response
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                We aim to respond to reported security issues
                                within 48 hours.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/40">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                <CheckCircle2 size={19} />
                            </div>

                            <h2 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                                Responsible Disclosure
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Responsible disclosure of security vulnerabilities
                                is appreciated and respected.
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

                        {/* Introduction */}

                        <div>
                            <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                    <ShieldCheck size={18} />
                                </div>

                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    Our Security Commitment
                                </h2>

                            </div>

                            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
                                At Deepak Khira Enterprises, we take security seriously.
                                We encourage responsible reporting of security
                                vulnerabilities so that potential issues can be
                                reviewed and addressed appropriately.
                            </p>
                        </div>

                        <div className="my-8 h-px bg-slate-200 dark:bg-slate-800" />

                        {/* =====================================================
                1. REPORTING ISSUES
            ====================================================== */}

                        <section>

                            <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                    <Mail size={18} />
                                </div>

                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                    1. Reporting Security Issues
                                </h2>

                            </div>

                            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
                                If you discover a security issue, please report it
                                immediately through the following email address:
                            </p>

                            <a
                                href="mailto:deepakkushwah475110@gmail.com"
                                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:border-blue-200 hover:bg-blue-100 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:bg-blue-950/50"
                            >
                                <Mail size={16} />

                                deepakkushwah475110@gmail.com
                            </a>

                        </section>

                        <div className="my-8 h-px bg-slate-200 dark:bg-slate-800" />

                        {/* =====================================================
                2. RESPONSIBILITIES
            ====================================================== */}

                        <section>

                            <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                    <CheckCircle2 size={18} />
                                </div>

                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                    2. Our Responsibilities
                                </h2>

                            </div>

                            <ul className="mt-5 space-y-3">

                                <li className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">

                                    <CheckCircle2
                                        size={18}
                                        className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                                    />

                                    <span className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                                        We aim to respond to reported security issues
                                        within 48 hours.
                                    </span>

                                </li>

                                <li className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">

                                    <CheckCircle2
                                        size={18}
                                        className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                                    />

                                    <span className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                                        We work to address verified vulnerabilities
                                        as quickly as reasonably possible.
                                    </span>

                                </li>

                                <li className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">

                                    <CheckCircle2
                                        size={18}
                                        className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                                    />

                                    <span className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                                        Responsible disclosure is appreciated and
                                        respected.
                                    </span>

                                </li>

                            </ul>

                        </section>

                        {/* =====================================================
                RESPONSIBLE DISCLOSURE NOTE
            ====================================================== */}

                        <div className="mt-10 flex gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">

                            <AlertTriangle
                                size={19}
                                className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
                            />

                            <div>

                                <p className="text-sm font-semibold text-amber-900 dark:text-amber-300">
                                    Responsible Disclosure
                                </p>

                                <p className="mt-1 text-sm leading-6 text-amber-800/80 dark:text-amber-300/70">
                                    Please report security concerns responsibly and
                                    avoid publicly disclosing vulnerability details
                                    before the issue has been reviewed.
                                </p>

                            </div>

                        </div>

                    </article>

                </div>
            </section>

        </div>
    );
}