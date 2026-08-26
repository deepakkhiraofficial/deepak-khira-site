import type { Metadata } from "next";
import {
    Truck,
    Clock3,
    MapPin,
    PackageCheck,
    Info,
} from "lucide-react";

export const metadata: Metadata = {
    title: "Shipping Policy | Deepak Khira Enterprises",
    description:
        "Read the shipping and delivery policy of Deepak Khira Enterprises, including delivery timelines, shipping charges and order tracking information across India.",

    alternates: {
        canonical: "/shipping-policy",
    },

    openGraph: {
        title: "Shipping Policy | Deepak Khira Enterprises",
        description:
            "Learn about delivery timelines, shipping charges and order tracking at Deepak Khira Enterprises.",
        url: "https://deepak-khira-enterprises.in/shipping-policy",
        siteName: "Deepak Khira Enterprises",
        type: "website",
    },
};

const shippingInformation = [
    {
        icon: Clock3,
        title: "Delivery Time",
        description:
            "Products are delivered within 3–7 business days.",
    },
    {
        icon: Truck,
        title: "Shipping Charges",
        description:
            "Shipping charges depend on the delivery location and product weight.",
    },
    {
        icon: PackageCheck,
        title: "Order Tracking",
        description:
            "You will receive tracking updates by SMS or email.",
    },
];

export default function ShippingPolicy() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">

            {/* =========================================================
          HEADER
      ========================================================== */}

            <section className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
                <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-16">

                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                            <Truck size={21} />
                        </div>

                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600 dark:text-blue-400">
                                Customer Information
                            </p>

                            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
                                Shipping Policy
                            </h1>
                        </div>
                    </div>

                    <p className="mt-6 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-400">
                        We offer safe and fast delivery across India. This page
                        explains our delivery timelines, shipping charges and
                        order tracking information.
                    </p>

                </div>
            </section>

            {/* =========================================================
          QUICK INFORMATION
      ========================================================== */}

            <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                        {shippingInformation.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.title}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-blue-900"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                        <Icon size={19} />
                                    </div>

                                    <h2 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                                        {item.title}
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}

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
                            <div className="flex items-center gap-2">
                                <MapPin
                                    size={19}
                                    className="text-blue-600 dark:text-blue-400"
                                />

                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    Shipping & Delivery
                                </h2>
                            </div>

                            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
                                We offer safe and fast delivery across India. Our
                                shipping process is designed to provide customers
                                with a reliable shopping and delivery experience.
                            </p>
                        </div>

                        <div className="my-8 h-px bg-slate-200 dark:bg-slate-800" />

                        {/* Delivery Time */}

                        <section>
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                    <Clock3 size={17} />
                                </div>

                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Delivery Time
                                </h2>
                            </div>

                            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
                                Products are delivered within{" "}
                                <strong className="font-semibold text-slate-900 dark:text-white">
                                    3–7 business days
                                </strong>
                                .
                            </p>
                        </section>

                        <div className="my-8 h-px bg-slate-200 dark:bg-slate-800" />

                        {/* Shipping Charges */}

                        <section>
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                    <Truck size={17} />
                                </div>

                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Shipping Charges
                                </h2>
                            </div>

                            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
                                Shipping charges depend on the delivery location
                                and product weight.
                            </p>
                        </section>

                        <div className="my-8 h-px bg-slate-200 dark:bg-slate-800" />

                        {/* Order Tracking */}

                        <section>
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                    <PackageCheck size={17} />
                                </div>

                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Order Tracking
                                </h2>
                            </div>

                            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
                                You will receive tracking updates by SMS or email.
                            </p>
                        </section>

                        {/* Important Note */}

                        <div className="mt-10 flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
                            <Info
                                size={19}
                                className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                            />

                            <div>
                                <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                                    Shipping Information
                                </p>

                                <p className="mt-1 text-sm leading-6 text-blue-800/80 dark:text-blue-300/70">
                                    Delivery timelines and shipping charges may vary
                                    depending on the delivery location and product.
                                </p>
                            </div>
                        </div>

                    </article>

                </div>
            </section>

        </div>
    );
}