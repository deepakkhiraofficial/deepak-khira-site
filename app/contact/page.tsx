"use client";

import SEO from "@/components/SEO";
import ContactForm from "@/components/sections/ContactForm";

import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaWhatsapp,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

export default function Contact() {
  const phone = "+919109001109";
  const email = "deepakkhiraenterprises@gmail.com";

  return (
    <>
      <SEO
        title="Contact Us | Deepak Khira Enterprises"
        description="Contact Deepak Khira Enterprises for product enquiries, customer support, business enquiries and partnership opportunities."
        url="https://deepak-khira-enterprises.com/contact"
        image="/contact-banner.jpg"
        keywords={[
          "Deepak Khira Enterprises contact",
          "Deepak Khira contact",
          "customer support",
          "product enquiry",
          "business enquiry",
          "business partnership",
        ]}
        schema={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Deepak Khira Enterprises",
          url: "https://deepak-khira-enterprises.com",
          logo: "https://deepak-khira-enterprises.com/business_logo.png",
          telephone: phone,
          email,
          contactPoint: {
            "@type": "ContactPoint",
            telephone: phone,
            email,
            contactType: "customer service",
            availableLanguage: ["English", "Hindi"],
          },
        }}
      />

      <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white">
        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
          {/* Background decoration */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-blue-100/60 blur-3xl dark:bg-blue-950/20"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 -left-40 h-[320px] w-[320px] rounded-full bg-slate-200/60 blur-3xl dark:bg-slate-900"
          />

          <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <div className="max-w-4xl">
              {/* Eyebrow */}

              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2 dark:border-blue-900/50 dark:bg-blue-950/30">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />

                <span className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700 dark:text-blue-400">
                  Contact Deepak Khira Enterprises
                </span>
              </div>

              {/* Heading */}

              <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-[1.08] tracking-[-0.04em] text-slate-950 sm:text-5xl md:text-6xl lg:text-[68px] lg:leading-[1.04] dark:text-white">
                Let&apos;s talk about
                <span className="block text-blue-600">your requirements.</span>
              </h1>

              {/* Description */}

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-400">
                Have a product question, need customer support, or want to
                discuss a business opportunity? Send us a message and our team
                will get back to you.
              </p>

              {/* CTA */}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#contact-form"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-white dark:text-slate-950 dark:hover:bg-blue-50"
                >
                  Send an Enquiry
                  <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1" />
                </a>

                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 transition hover:border-blue-500 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:border-blue-500 dark:hover:text-blue-400"
                >
                  <FaPhoneAlt className="text-xs" />
                  Call Us
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            CONTACT CONTENT
        ====================================================== */}

        <section id="contact-form" className="bg-white dark:bg-slate-950">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20 lg:px-12 lg:py-24">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
              {/* =================================================
                  FORM
              ================================================== */}

              <div className="lg:col-span-7">
                <div className="mb-7">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
                    Send us a message
                  </p>

                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
                    How can we help?
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base dark:text-slate-400">
                    Tell us what you need and provide as much detail as
                    possible. This helps us respond with the right information.
                  </p>
                </div>

                {/* Form */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_40px_rgba(15,23,42,0.05)] sm:p-7 md:p-9 dark:border-slate-800 dark:bg-slate-900/40 dark:shadow-none">
                  <ContactForm />
                </div>
              </div>

              {/* =================================================
                  CONTACT INFORMATION
              ================================================== */}

              <aside className="lg:col-span-5">
                <div className="lg:sticky lg:top-24">
                  <div className="mb-7">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
                      Get in touch
                    </p>

                    <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
                      Contact information
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      You can reach us directly using any of the following
                      channels.
                    </p>
                  </div>

                  {/* Contact list */}

                  <div className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                    {/* PHONE */}

                    <a
                      href={`tel:${phone}`}
                      className="group flex items-start gap-4 py-5"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:group-hover:border-blue-900 dark:group-hover:bg-blue-950/30 dark:group-hover:text-blue-400">
                        <FaPhoneAlt className="text-sm" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          Phone
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-900 transition group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                          +91 91090 01109
                        </p>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Customer &amp; business enquiries
                        </p>
                      </div>
                    </a>

                    {/* EMAIL */}

                    <a
                      href={`mailto:${email}`}
                      className="group flex items-start gap-4 py-5"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:group-hover:border-blue-900 dark:group-hover:bg-blue-950/30 dark:group-hover:text-blue-400">
                        <FaEnvelope className="text-sm" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          Email
                        </p>

                        <p className="mt-1 break-all text-sm font-semibold text-slate-900 transition group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                          {email}
                        </p>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          We&apos;ll respond to your enquiry
                        </p>
                      </div>
                    </a>

                    {/* LOCATION */}

                    <div className="flex items-start gap-4 py-5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                        <FaMapMarkerAlt className="text-sm" />
                      </div>

                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          Location
                        </p>

                        <p className="mt-1 text-sm font-semibold leading-6 text-slate-900 dark:text-white">
                          Dabra, Gwalior
                          <br />
                          Madhya Pradesh, India — 475110
                        </p>

                        <a
                          href="https://www.google.com/maps/search/?api=1&query=Dabra%2C%20Gwalior%2C%20Madhya%20Pradesh%20475110%2C%20India"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        >
                          Get directions
                          <FaArrowRight className="text-[9px]" />
                        </a>
                      </div>
                    </div>

                    {/* HOURS */}

                    <div className="flex items-start gap-4 py-5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                        <FaClock className="text-sm" />
                      </div>

                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          Business hours
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                          Monday — Sunday
                        </p>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          9:00 AM — 9:00 PM
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* =================================================
                      WHATSAPP CARD
                  ================================================== */}

                  <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900/50">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-sm">
                        <FaWhatsapp className="text-lg" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          Need a quick response?
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                          Start a conversation with us directly on WhatsApp.
                        </p>
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/${phone.replace(
                        "+",
                        ""
                      )}?text=Hello%20Deepak%20Khira%20Enterprises%2C%20I%20have%20an%20enquiry.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-5 flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-slate-950 hover:text-white dark:bg-slate-800 dark:text-white dark:hover:bg-white dark:hover:text-slate-950"
                    >
                      <span>Chat on WhatsApp</span>

                      <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1" />
                    </a>
                  </div>

                  {/* =================================================
                      TRUST POINTS
                  ================================================== */}

                  <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <FaCheckCircle className="shrink-0 text-blue-600 dark:text-blue-400" />
                      Customer-focused support
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <FaCheckCircle className="shrink-0 text-blue-600 dark:text-blue-400" />
                      Product and order enquiries
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <FaCheckCircle className="shrink-0 text-blue-600 dark:text-blue-400" />
                      Business and partnership enquiries
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* =====================================================
            BUSINESS CTA
        ====================================================== */}

        <section className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/30">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12">
            <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white px-6 py-7 shadow-sm sm:px-8 md:flex-row md:items-center md:justify-between dark:border-slate-800 dark:bg-slate-900">
              <div>
                <p className="text-sm font-bold text-slate-950 dark:text-white">
                  Have a business enquiry?
                </p>

                <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                  We welcome genuine business enquiries, collaborations and
                  long-term partnership opportunities.
                </p>
              </div>

              <a
                href={`mailto:${email}?subject=Business%20Enquiry%20-%20Deepak%20Khira%20Enterprises`}
                className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-600 dark:bg-white dark:text-slate-950 dark:hover:bg-blue-50"
              >
                Send Business Enquiry
                <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
