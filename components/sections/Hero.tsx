"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="w-full bg-white dark:bg-gray-800 pt-32 pb-20 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-sm">
      <div className="max-w-xl space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold text-blue-700 dark:text-blue-400 leading-tight"
        >
          Deepak Khira Enterprises – Trusted Online Seller in India
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-700 dark:text-gray-300 font-medium"
        >
          Genuine Products • Fast Delivery • Secure Packaging • 100%
          Satisfaction
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-gray-600 dark:text-gray-400 text-base md:text-lg"
        >
          We provide premium quality products with safe packaging, reliable
          delivery, and customer-centric service across India.
        </motion.p>

        <div className="flex gap-4 pt-4">
          <button className="px-6 py-3 bg-blue-700 text-white rounded-xl text-lg shadow hover:bg-blue-800 transition-all transform hover:scale-105">
            Shop Now
          </button>

          <button className="px-6 py-3 bg-gray-200 dark:bg-gray-700 dark:text-white text-gray-900 rounded-xl text-lg shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition-all transform hover:scale-105">
            Contact Us
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex justify-center items-center"
      >
        <Image
          src="/business_logo.png"
          alt="Deepak Khira Enterprises Logo"
          width={340}
          height={340}
          className="drop-shadow-xl rounded-2xl"
        />
      </motion.div>
    </section>
  );
}
