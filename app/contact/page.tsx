"use client";

import ContactForm from "@/components/sections/ContactForm";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";


export default function Contact() {
  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 md:px-16">
        <div className="md:flex md:gap-12 items-start">
          {/* Contact Form */}
          <div className="md:flex-1">
            <ContactForm />
          </div>
          {/* Company Info */}
          <div className="md:flex-1 mt-12 md:mt-0 text-gray-700 dark:text-gray-300 space-y-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Reach Us
            </h2>
            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-blue-600 dark:text-blue-400 text-xl" />
              <span>+91 9109001109</span>
            </div>
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-blue-600 dark:text-blue-400 text-xl" />
              <span>deepakkhushwah475110@gmail.com</span>
            </div>
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400 text-xl" />
              <span>Dabra, Gwalior, Madhya Pradesh, India – 475110</span>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-6 text-2xl">
              <a href="#" className="hover:text-blue-600 transition">
                🌐
              </a>
              <a href="#" className="hover:text-blue-600 transition">
                📸
              </a>
              <a href="#" className="hover:text-blue-600 transition">
                💼
              </a>
              <a href="#" className="hover:text-blue-600 transition">
                🐦
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
