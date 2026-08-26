"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Users,
} from "lucide-react";

export default function AboutUs() {
  const highlights = [
    {
      icon: ShieldCheck,
      title: "Quality Focused",
      description:
        "Products are selected with quality, value and customer satisfaction in mind.",
    },
    {
      icon: Users,
      title: "Customer First",
      description:
        "We focus on dependable service and a smooth shopping experience.",
    },
    {
      icon: Building2,
      title: "Growing Business",
      description:
        "Building a trusted presence across e-commerce and multiple business categories.",
    },
  ];

  return (
    <section
      id="about"
      className="border-y border-slate-200 bg-slate-50 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
              About Deepak Khira Enterprises
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              A business built around
              <span className="text-blue-600"> quality and trust.</span>
            </h2>
          </div>

          <Link
            href="/contact"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-900 transition hover:text-blue-600"
          >
            Get in touch
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          {/* LEFT */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Building2 className="h-6 w-6" />
            </div>

            <h3 className="mt-6 text-xl font-bold text-slate-950">
              Who we are
            </h3>

            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
              <p>
                Deepak Khira Enterprises is a growing business based in Madhya
                Pradesh, focused on bringing quality products and dependable
                service to customers across India.
              </p>

              <p>
                We believe that a good shopping experience is built on more than
                just a product. Quality, secure packaging, reliable delivery and
                responsive customer support are all part of the experience.
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="grid gap-4 sm:grid-cols-3">
            {highlights.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-5 text-base font-bold text-slate-950">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
