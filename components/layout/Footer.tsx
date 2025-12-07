"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white py-16">
      <div className="container mx-auto px-6 md:px-16 grid md:grid-cols-3 gap-12">
        {/* About / Company Info */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Deepak Khira Enterprises</h2>

          <p className="text-gray-200">
            Deepak Khira Enterprises — trusted online seller and service
            provider in India. We offer premium quality products, website
            development, mobile apps, e-commerce solutions, and professional
            business support services.
          </p>

          <div className="space-y-2 text-gray-200">
            <div className="flex items-center gap-2">
              <FaPhoneAlt /> +91 9109001109
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope /> deepakkhushwah475110@gmail.com
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt /> Dabra, Gwalior, Madhya Pradesh, India – 475110
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col space-y-3 text-gray-200">
          <h3 className="text-xl font-semibold mb-2">Quick Links</h3>
          <Link href="#services" className="hover:underline transition">
            Services
          </Link>
          <Link href="#products" className="hover:underline transition" prefetch>
            Products
          </Link>
          <Link href="#contact" className="hover:underline transition">
            Contact
          </Link>
          <Link href="#about" className="hover:underline transition">
            About
          </Link>
        </div>

        {/* Social Icons */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <h3 className="text-xl font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4 text-2xl">
            <Link href="#" className="hover:text-gray-200 transition">
              <FaFacebookF />
            </Link>
            <Link href="#" className="hover:text-gray-200 transition">
              <FaInstagram />
            </Link>
            <Link href="#" className="hover:text-gray-200 transition">
              <FaLinkedinIn />
            </Link>
            <Link href="#" className="hover:text-gray-200 transition">
              <FaTwitter />
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-300 mt-12 text-sm">
        &copy; {new Date().getFullYear()} Deepak Khira Enterprises. All Rights
        Reserved. Designed with ❤️ by Deepak Kushwah.
      </div>

      {/* SEO: LocalBusiness Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Deepak Khira Enterprises",
            image: "https://deepak-khira-enterprises.com/logo.png",
            url: "https://deepak-khira-enterprises.com",
            telephone: "+919109001109",
            email: "deepakkhushwah475110@gmail.com",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Dabra",
              addressLocality: "Gwalior",
              addressRegion: "Madhya Pradesh",
              postalCode: "475110",
              addressCountry: "IN",
            },
            openingHours: "Mo-Su 09:00-21:00",
          }),
        }}
      />
    </footer>
  );
}
