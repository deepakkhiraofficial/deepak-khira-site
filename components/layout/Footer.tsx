"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaArrowUp,
} from "react-icons/fa";
import {
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiOutlineRefresh,
  HiOutlineCreditCard,
  HiOutlineChatAlt2,
} from "react-icons/hi";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const companyLinks = [
    { label: "About Us", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Our Services", href: "/services" },
    { label: "Contact Us", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ];

  const customerLinks = [
    { label: "My Orders", href: "/orders" },
    { label: "Shipping Policy", href: "/shipping-policy" },
    { label: "Refund Policy", href: "/refund-policy" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Security Policy", href: "/security-policy" },
    { label: "Support", href: "/support" },
  ];

  const accountLinks = [
    { label: "My Account", href: "/account" },
    { label: "Shopping Cart", href: "/cart" },
    { label: "Checkout", href: "/checkout" },
  ];

  const services = [
    {
      icon: HiOutlineShieldCheck,
      title: "Quality Products",
      description: "Carefully selected products",
    },
    {
      icon: HiOutlineTruck,
      title: "Fast Delivery",
      description: "Reliable delivery across India",
    },
    {
      icon: HiOutlineRefresh,
      title: "Easy Returns",
      description: "Customer-friendly policies",
    },
    {
      icon: HiOutlineCreditCard,
      title: "Secure Payments",
      description: "Safe & secure checkout",
    },
    {
      icon: HiOutlineChatAlt2,
      title: "Customer Support",
      description: "We're here to help",
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white dark:border-slate-800">
      {/* =========================================================
          TRUST STRIP
      ========================================================== */}

      <div className="border-b border-white/10 bg-slate-900">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/10 px-5 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 lg:px-8">
          <div className="flex items-center gap-4 px-0 py-5 sm:px-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600/15 text-blue-400">
              <HiOutlineShieldCheck className="text-xl" />
            </div>

            <div>
              <p className="text-sm font-bold">Quality Products</p>
              <p className="mt-0.5 text-xs text-slate-400">
                Carefully selected
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-0 py-5 sm:px-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600/15 text-blue-400">
              <HiOutlineTruck className="text-xl" />
            </div>

            <div>
              <p className="text-sm font-bold">Fast Delivery</p>
              <p className="mt-0.5 text-xs text-slate-400">Across India</p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-0 py-5 sm:px-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600/15 text-blue-400">
              <HiOutlineRefresh className="text-xl" />
            </div>

            <div>
              <p className="text-sm font-bold">Easy Returns</p>
              <p className="mt-0.5 text-xs text-slate-400">
                Customer-friendly policies
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-0 py-5 sm:px-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600/15 text-blue-400">
              <HiOutlineCreditCard className="text-xl" />
            </div>

            <div>
              <p className="text-sm font-bold">Secure Payments</p>
              <p className="mt-0.5 text-xs text-slate-400">
                Safe & secure checkout
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          MAIN FOOTER
      ========================================================== */}

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr_1.2fr_1.1fr_1.4fr] lg:gap-8">
          {/* =====================================================
              BRAND
          ====================================================== */}

          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3"
              aria-label="Deepak Khira Enterprises Home"
            >
              <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-white p-1">
                <Image
                  src="/business_logo.png"
                  alt="Deepak Khira Enterprises"
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              </div>

              <div>
                <p className="text-base font-bold leading-tight">
                  Deepak Khira
                </p>

                <p className="text-sm font-medium text-slate-400">
                  Enterprises
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
              Your trusted online shopping destination for quality products,
              reliable service and a smooth shopping experience across India.
            </p>

            {/* Social */}

            <div className="mt-6 flex items-center gap-2.5">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:border-blue-500 hover:bg-blue-600 hover:text-white"
              >
                <FaFacebookF className="text-sm" />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:border-pink-500 hover:bg-pink-600 hover:text-white"
              >
                <FaInstagram className="text-sm" />
              </a>

              <a
                href="#"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:border-red-500 hover:bg-red-600 hover:text-white"
              >
                <FaYoutube className="text-sm" />
              </a>

              <a
                href="https://wa.me/919109001109"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:border-green-500 hover:bg-green-600 hover:text-white"
              >
                <FaWhatsapp className="text-sm" />
              </a>
            </div>
          </div>

          {/* =====================================================
              COMPANY
          ====================================================== */}

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Company
            </h3>

            <ul className="mt-5 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* =====================================================
              CUSTOMER SERVICE
          ====================================================== */}

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Customer Service
            </h3>

            <ul className="mt-5 space-y-3">
              {customerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* =====================================================
              ACCOUNT + SERVICES
          ====================================================== */}

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              My Account
            </h3>

            <ul className="mt-5 space-y-3">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="mt-8 text-sm font-bold uppercase tracking-wider text-white">
              Services
            </h3>

            <Link
              href="/services"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
            >
              Explore our services
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* =====================================================
              GET IN TOUCH
          ====================================================== */}

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Get In Touch
            </h3>

            <div className="mt-5 space-y-4">
              {/* Phone */}

              <a
                href="tel:+919109001109"
                className="group flex items-start gap-3"
              >
                <FaPhoneAlt className="mt-1 shrink-0 text-sm text-blue-400" />

                <span className="text-sm text-slate-400 transition group-hover:text-white">
                  +91 91090 01109
                </span>
              </a>

              {/* Email */}

              <a
                href="mailto:deepakkhiraenterprises@gmail.com"
                className="group flex items-start gap-3"
              >
                <FaEnvelope className="mt-1 shrink-0 text-sm text-blue-400" />

                <span className="break-all text-sm text-slate-400 transition group-hover:text-white">
                  deepakkhiraenterprises@gmail.com
                </span>
              </a>

              {/* Location */}

              <a
                href="https://www.google.com/maps/search/?api=1&query=Dabra%2C%20Gwalior%2C%20Madhya%20Pradesh%20475110%2C%20India"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3"
              >
                <FaMapMarkerAlt className="mt-1 shrink-0 text-sm text-blue-400" />

                <span className="text-sm leading-6 text-slate-400 transition group-hover:text-white">
                  Dabra, Gwalior
                  <br />
                  Madhya Pradesh, India — 475110
                </span>
              </a>

              {/* Hours */}

              <div className="flex items-start gap-3">
                <FaClock className="mt-1 shrink-0 text-sm text-blue-400" />

                <span className="text-sm leading-6 text-slate-400">
                  Monday — Sunday
                  <br />
                  9:00 AM — 9:00 PM
                </span>
              </div>
            </div>

            {/* WhatsApp */}

            <a
              href="https://wa.me/919109001109?text=Hello%20Deepak%20Khira%20Enterprises%2C%20I%20need%20help."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-between rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-700"
            >
              <span className="flex items-center gap-2">
                <FaWhatsapp className="text-lg" />
                Chat on WhatsApp
              </span>

              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        {/* =========================================================
            SERVICES
        ========================================================== */}

        <div className="mt-14 border-t border-white/10 pt-10">
          <h3 className="text-center text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Why Shop With Us
          </h3>

          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-4"
                >
                  <Icon className="mt-0.5 shrink-0 text-xl text-blue-400" />

                  <div>
                    <p className="text-sm font-semibold text-slate-200">
                      {service.title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {service.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================
            LEGAL / BOTTOM BAR
        ========================================================== */}

        <div className="mt-12 border-t border-white/10 pt-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            {/* Copyright */}

            <p className="text-xs leading-5 text-slate-500">
              © {currentYear} Deepak Khira Enterprises. All rights reserved.
            </p>

            {/* Legal */}

            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <Link
                href="/privacy-policy"
                className="text-xs text-slate-500 transition hover:text-white"
              >
                Privacy
              </Link>

              <Link
                href="/security-policy"
                className="text-xs text-slate-500 transition hover:text-white"
              >
                Security
              </Link>

              <Link
                href="/refund-policy"
                className="text-xs text-slate-500 transition hover:text-white"
              >
                Refunds
              </Link>

              <Link
                href="/shipping-policy"
                className="text-xs text-slate-500 transition hover:text-white"
              >
                Shipping
              </Link>

              <Link
                href="/terms-and-conditions"
                className="text-xs text-slate-500 transition hover:text-white"
              >
                Terms
              </Link>
            </div>

            {/* Back to top */}

            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition hover:border-blue-500 hover:bg-blue-600 hover:text-white"
            >
              ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
