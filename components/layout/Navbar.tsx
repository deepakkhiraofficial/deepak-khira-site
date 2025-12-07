"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

export default function Navbar() {
  const pathname = usePathname(); // for active link detection
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Products", href: "/products" },
    { name: "Blogs", href: "/blogs" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-2xl text-gray-800">
          Deepak Khira
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-6">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${
                  pathname === link.href
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700 hover:text-blue-600 transition-colors"
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 hover:text-blue-600 focus:outline-none"
          >
            {isOpen ? <HiOutlineX size={28} /> : <HiOutlineMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <ul className="flex flex-col space-y-4 px-6 py-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block ${
                    pathname === link.href
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700 hover:text-blue-600 transition-colors"
                  }`}
                  onClick={() => setIsOpen(false)} // close menu on click
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
