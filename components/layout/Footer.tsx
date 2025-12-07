"use client";

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
            Leading online business providing professional web development,
            mobile apps, and UI/UX solutions tailored to your needs.
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
          <a href="#services" className="hover:underline transition">
            Services
          </a>
          <a href="#products" className="hover:underline transition">
            Products
          </a>
          <a href="#contact" className="hover:underline transition">
            Contact
          </a>
          <a href="#about" className="hover:underline transition">
            About
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <h3 className="text-xl font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4 text-2xl">
            <a href="#" className="hover:text-gray-200 transition">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-gray-200 transition">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-gray-200 transition">
              <FaLinkedinIn />
            </a>
            <a href="#" className="hover:text-gray-200 transition">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-300 mt-12 text-sm">
        &copy; {new Date().getFullYear()} Deepak Khira Enterprises. All Rights
        Reserved. Designed with ❤️ by Deepak Kushwah.
      </div>
    </footer>
  );
}
