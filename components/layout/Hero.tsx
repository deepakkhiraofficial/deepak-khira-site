"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 text-white py-28 md:py-40">
      {/* Premium Glow Effects */}
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-white/10 blur-3xl rounded-full" />
      <div className="absolute bottom-[-60px] right-[-60px] w-96 h-96 bg-blue-300/10 blur-3xl rounded-full" />

      <div className="container mx-auto px-6 text-center relative z-10 max-w-4xl">
        {/* Big Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight drop-shadow-md"
        >
          Premium Products & Digital Solutions
          <br />
          <span className="text-white/90 text-3xl md:text-5xl font-bold block mt-3">
            Trusted By Thousands Across India
          </span>
        </motion.h1>

        {/* Sub Title */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="text-lg md:text-2xl max-w-2xl mx-auto mt-5 opacity-90 leading-relaxed"
        >
          Fast Delivery • Genuine Products • Secure Packaging
          <br className="hidden md:block" />
          Your trusted online seller & business solution provider.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          {/* Primary CTA */}
          <Link
            href="/products"
            className="px-10 py-3 text-lg font-semibold rounded-xl bg-white text-blue-700 shadow-xl hover:bg-gray-100 transition-all duration-300 hover:scale-[1.03] active:scale-95"
          >
            Shop Now
          </Link>

          {/* Secondary CTA */}
          <Link
            href="/services"
            className="px-10 py-3 text-lg font-semibold rounded-xl backdrop-blur border border-white/40 bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-[1.03] active:scale-95"
          >
            Explore Services
          </Link>

          {/* Contact CTA */}
          <Link
            href="/contact"
            className="px-10 py-3 text-lg font-semibold rounded-xl border border-white/70 hover:bg-white/10 transition-all duration-300 hover:scale-[1.03] active:scale-95"
          >
            Contact Us
          </Link>
        </motion.div>
      </div>

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-blue-900/30 to-transparent" />
    </section>
  );
}
