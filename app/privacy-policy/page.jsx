// import type { Metadata } from "next";
import {
    ShieldCheck,
    UserRound,
    CreditCard,
    Cookie,
    LockKeyhole,
    Share2,
    UserCheck,
    RefreshCcw,
    Mail,
    Phone,
    Info,
} from "lucide-react";

export const  Metadata = {
    title: "Privacy Policy | Deepak Khira Enterprises",

    description:
        "Read the Privacy Policy for Deepak Khira Enterprises. Learn how we collect, use, and protect your personal information while using our website and services.",

    alternates: {
        canonical: "/privacy",
    },

    openGraph: {
        title: "Privacy Policy | Deepak Khira Enterprises",
        description:
            "Learn how Deepak Khira Enterprises collects, uses and protects personal information.",
        url: "https://deepak-khira-enterprises.in/privacy",
        siteName: "Deepak Khira Enterprises",
        type: "website",
    },
};

const sections = [
    {
        number: "1",
        title: "Introduction",
        icon: ShieldCheck,
        content: (
            <p>
                Deepak Khira Enterprises respects your privacy and is
                committed to protecting your personal information. This
                policy explains how we collect, use, and safeguard your
                data when you use our website or services.
            </p>
        ),
    },

    {
        number: "2",
        title: "Information We Collect",
        icon: UserRound,
        content: (
            <>
                <p>
                    We may collect the following information:
                </p>

                <ul>
                    <li>
                        <strong>Personal details:</strong> name, email,
                        phone number, and shipping address.
                    </li>

                    <li>
                        <strong>Payment information:</strong> card details
                        may be processed through secure payment gateways.
                        We do not store card information.
                    </li>

                    <li>
                        <strong>Usage data:</strong> pages visited,
                        products viewed, and shopping behavior.
                    </li>
                </ul>
            </>
        ),
    },

    {
        number: "3",
        title: "How We Use Your Information",
        icon: CreditCard,
        content: (
            <>
                <p>
                    Your information may be used for:
                </p>

                <ul>
                    <li>Processing orders and payments.</li>
                    <li>
                        Providing customer support and communication.
                    </li>
                    <li>
                        Improving our website, products, and services.
                    </li>
                    <li>
                        Sending promotional offers only if you have
                        opted in.
                    </li>
                </ul>
            </>
        ),
    },

    {
        number: "4",
        title: "Cookies and Tracking",
        icon: Cookie,
        content: (
            <p>
                We use cookies and similar technologies to enhance
                your shopping experience, remember your preferences,
                and analyze website traffic. You can manage cookies
                through your browser settings.
            </p>
        ),
    },

    {
        number: "5",
        title: "Data Sharing and Security",
        icon: LockKeyhole,
        content: (
            <p>
                We do not sell or share your personal information with
                third parties except as necessary to process orders
                or comply with the law. We implement security measures
                designed to protect your data.
            </p>
        ),
    },

    {
        number: "6",
        title: "Third-Party Services",
        icon: Share2,
        content: (
            <p>
                Our website may use third-party services, such as
                payment gateways and analytics providers. These
                services have their own privacy policies, and we
                recommend reviewing their respective privacy policies.
            </p>
        ),
    },

    {
        number: "7",
        title: "Your Rights",
        icon: UserCheck,
        content: (
            <p>
                You have the right to access, correct, or request
                deletion of your personal information. You can also
                opt out of promotional emails at any time.
            </p>
        ),
    },

    {
        number: "8",
        title: "Changes to This Policy",
        icon: RefreshCcw,
        content: (
            <p>
                We may update this Privacy Policy from time to time.
                Changes will be posted on this page with the effective
                date.
            </p>
        ),
    },
];

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">

            {/* =========================================================
          HEADER
      ========================================================== */}

            <section className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">

                <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-16">

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                            <ShieldCheck size={22} />
                        </div>

                        <div>

                            <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600 dark:text-blue-400">
                                Privacy & Security
                            </p>

                            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
                                Privacy Policy
                            </h1>

                        </div>

                    </div>

                    <p className="mt-6 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-400">
                        Learn how Deepak Khira Enterprises collects, uses,
                        protects, and handles personal information when you
                        use our website or services.
                    </p>

                </div>

            </section>

            {/* =========================================================
          PRIVACY HIGHLIGHTS
      ========================================================== */}

            <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">

                <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/40">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                <LockKeyhole size={19} />
                            </div>

                            <h2 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                                Data Protection
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                We take reasonable measures to protect personal
                                information handled through our website.
                            </p>

                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/40">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                <UserCheck size={19} />
                            </div>

                            <h2 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                                Your Information
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                You may request access, correction, or deletion
                                of your personal information.
                            </p>

                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/40">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                <Cookie size={19} />
                            </div>

                            <h2 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                                Cookies
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Cookies may be used to remember preferences and
                                understand website usage.
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

                    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/30">

                        <div className="divide-y divide-slate-200 dark:divide-slate-800">

                            {sections.map((section) => {

                                const Icon = section.icon;

                                return (
                                    <section
                                        key={section.number}
                                        className="p-6 sm:p-8"
                                    >

                                        <div className="flex items-start gap-4">

                                            {/* Number */}

                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                                {section.number}
                                            </div>

                                            {/* Content */}

                                            <div className="min-w-0 flex-1">

                                                <div className="flex items-center gap-2">

                                                    <Icon
                                                        size={18}
                                                        className="shrink-0 text-blue-600 dark:text-blue-400"
                                                    />

                                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                                        {section.title}
                                                    </h2>

                                                </div>

                                                <div className="policy-content mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
                                                    {section.content}
                                                </div>

                                            </div>

                                        </div>

                                    </section>
                                );
                            })}

                        </div>

                        {/* =====================================================
                CONTACT
            ====================================================== */}

                        <section className="border-t border-slate-200 bg-slate-50 p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900/50">

                            <div className="flex items-start gap-4">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                    <Mail size={19} />
                                </div>

                                <div>

                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                        9. Contact Us
                                    </h2>

                                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                                        For any questions about this Privacy Policy,
                                        please contact us.
                                    </p>

                                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">

                                        <a
                                            href="mailto:deepakkhushwah475110@gmail.com"
                                            className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-blue-700 transition hover:border-blue-200 hover:bg-blue-50 dark:border-blue-900/50 dark:bg-slate-900 dark:text-blue-400 dark:hover:bg-blue-950/30"
                                        >
                                            <Mail size={16} />

                                            deepakkhushwah475110@gmail.com
                                        </a>

                                        <a
                                            href="tel:+919109001109"
                                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-900 dark:hover:text-blue-400"
                                        >
                                            <Phone size={16} />

                                            +91 9109001109
                                        </a>

                                    </div>

                                </div>

                            </div>

                        </section>

                    </article>

                    {/* =======================================================
              IMPORTANT INFORMATION
          ======================================================== */}

                    <div className="mt-6 flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">

                        <Info
                            size={19}
                            className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                        />

                        <p className="text-sm leading-6 text-blue-800/80 dark:text-blue-300/70">
                            This Privacy Policy may be updated from time to time.
                            Please check this page periodically for the latest
                            version.
                        </p>

                    </div>

                </div>

            </section>

            {/* =========================================================
          LOCAL STYLES
      ========================================================== */}

            <style>{`
        .policy-content p {
          margin: 0;
        }

        .policy-content ul {
          margin-top: 0.9rem;
          list-style: none;
          padding: 0;
          display: grid;
          gap: 0.75rem;
        }

        .policy-content li {
          position: relative;
          padding-left: 1.35rem;
        }

        .policy-content li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.65rem;
          width: 0.35rem;
          height: 0.35rem;
          border-radius: 9999px;
          background: currentColor;
          opacity: 0.65;
        }

        .policy-content strong {
          font-weight: 600;
        }
      `}</style>

        </div>
    );
}