"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <>
      {/* Fixed Navbar */}
      <Navbar />

      {/* FULL PAGE WRAPPER */}
      <main className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-all">
        {/* HERO SECTION */}
        <section
          className="w-full bg-white dark:bg-gray-800 pt-32 pb-20 px-6 md:px-16 
                            flex flex-col md:flex-row items-center justify-between gap-10 shadow-sm"
        >
          {/* Left content */}
          <div className="max-w-xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold text-blue-700 dark:text-blue-400 leading-tight">
              Deepak Khira Enterprises
            </h1>

            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 font-medium">
              Trusted Online Seller – Quality • Commitment • Fast Delivery
            </p>

            <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">
              We deliver high-quality products with safe packaging, reliable
              service, and 100% customer satisfaction.
            </p>

            <div className="flex gap-4 pt-4">
              <button className="px-6 py-3 bg-blue-700 text-white rounded-xl text-lg shadow hover:bg-blue-800 transition-all">
                Shop Now
              </button>

              <button
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 dark:text-white
                                 text-gray-900 rounded-xl text-lg shadow 
                                 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                Contact Us
              </button>
            </div>
          </div>

          {/* Logo Image */}
          <div className="flex justify-center items-center">
            <Image
              src="/business_logo.png"
              alt="Deepak Khira Enterprises Logo"
              width={340}
              height={340}
              className="drop-shadow-xl rounded-2xl"
            />
          </div>
        </section>

        {/* ABOUT US */}
        <section className="w-full py-20 px-6 md:px-16 bg-gray-100 dark:bg-gray-800">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-700 dark:text-blue-400 mb-10">
            About Us
          </h2>

          <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              Deepak Khira Enterprises is a trusted online selling brand based
              in Madhya Pradesh. We provide premium quality products at
              affordable prices, ensuring a smooth and safe shopping experience.
            </p>

            <p>
              With fast shipping, secure packaging, and excellent customer
              support, we focus on delivering value and satisfaction to our
              customers.
            </p>
          </div>
        </section>

        {/* PRODUCTS */}
        <section className="w-full py-20 px-6 md:px-16 bg-white dark:bg-gray-900">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-700 dark:text-blue-400 mb-12">
            Our Products
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="bg-gray-100 dark:bg-gray-700 p-6 rounded-2xl shadow hover:shadow-xl transition-all"
              >
                <div className="w-full h-40 bg-gray-300 dark:bg-gray-600 rounded-xl mb-4"></div>
                <h3 className="text-lg font-bold mb-2">Product {i}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  High-quality product description goes here.
                </p>

                <button className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800">
                  Buy Now
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="w-full py-20 px-6 md:px-16 bg-white dark:bg-gray-800">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-700 dark:text-blue-400 mb-12">
            Why Choose Us?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {[
              "Genuine Products",
              "Fast Delivery",
              "Affordable Prices",
              "Secure Packaging",
              "Best Customer Support",
              "Trusted Online Seller",
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gray-100 dark:bg-gray-700 p-8 rounded-2xl shadow hover:shadow-lg transition-all text-center text-lg font-medium text-gray-700 dark:text-gray-300"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* WHATSAPP FLOATING BUTTON */}
        <a
          href="https://wa.me/9109001109"
          target="_blank"
          className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-xl text-3xl hover:bg-green-600"
        >
          🟢
        </a>
      </main>
    </>
  );
}
