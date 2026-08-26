"use client";

import Link from "next/link";
import { ShoppingBag, Package, Store, ArrowRight } from "lucide-react";

const services = [
  {
    icon: ShoppingBag,
    title: "Online Shopping",
    description:
      "Discover products across our growing range of consumer categories.",
    href: "/products",
  },
  {
    icon: Package,
    title: "Product Fulfilment",
    description:
      "Careful order processing, secure packaging and dependable delivery.",
    href: "/products",
  },
  {
    icon: Store,
    title: "Business & Distribution",
    description:
      "Building opportunities across e-commerce, wholesale and distribution.",
    href: "/contact",
  },
];

export default function ServicesGrid() {
  return (
    <section id="services" className="bg-slate-950 py-20 text-white sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-400">
              What we do
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              More than a store.
              <br />
              <span className="text-blue-400">We are building a business.</span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-slate-400 sm:text-base">
            Deepak Khira Enterprises is building its presence across e-commerce
            and other business opportunities with a focus on quality,
            reliability and long-term growth.
          </p>
        </div>

        {/* SERVICES */}

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {services.map(({ icon: Icon, title, description, href }) => (
            <Link
              key={title}
              href={href}
              className="group rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition duration-200 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-white/[0.07]"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/15 text-blue-400">
                  <Icon className="h-6 w-6" />
                </div>

                <ArrowRight className="h-5 w-5 text-slate-600 transition group-hover:translate-x-1 group-hover:text-blue-400" />
              </div>

              <h3 className="mt-7 text-xl font-bold">{title}</h3>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                {description}
              </p>

              <div className="mt-6 text-sm font-semibold text-blue-400">
                Learn more
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
