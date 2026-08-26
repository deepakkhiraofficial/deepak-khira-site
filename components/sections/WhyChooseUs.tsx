"use client";

import {
  ShieldCheck,
  Truck,
  BadgeIndianRupee,
  PackageCheck,
  Headphones,
  Sparkles,
} from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Quality Assured",
    description:
      "We focus on offering products that deliver dependable quality and value.",
  },
  {
    icon: Truck,
    title: "Reliable Delivery",
    description:
      "Orders are carefully prepared and shipped with a focus on reliable delivery.",
  },
  {
    icon: BadgeIndianRupee,
    title: "Great Value",
    description:
      "Competitive pricing designed to give customers better value for their money.",
  },
  {
    icon: PackageCheck,
    title: "Secure Packaging",
    description:
      "Products are packed carefully to help protect them during transit.",
  },
  {
    icon: Headphones,
    title: "Customer Support",
    description:
      "We are committed to helping customers before and after their purchase.",
  },
  {
    icon: Sparkles,
    title: "Customer Experience",
    description:
      "From product discovery to delivery, we aim to keep shopping simple and convenient.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}

        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
            Why choose us
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Designed around your
            <span className="text-blue-600"> shopping experience.</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
            We focus on the details that matter — quality products, dependable
            fulfilment and a better customer experience.
          </p>
        </div>

        {/* BENEFITS */}

        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="bg-white p-7 transition hover:bg-slate-50 sm:p-8"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon className="h-5 w-5" />
              </div>

              <h3 className="mt-5 text-base font-bold text-slate-950">
                {title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
