"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Home", href: "/", prefetch: true },
    { name: "About Us", href: "/about", prefetch: true },
    { name: "Services", href: "/services", prefetch: true },
    { name: "Products", href: "/products", prefetch: true },
    { name: "Blogs", href: "/blogs", prefetch: true },
    { name: "Contact Us", href: "/contact", prefetch: true },
  ];

  return (
    <header className="shadow-md bg-white fixed top-0 left-0 w-full z-[1000]">
      <nav
        className="container mx-auto px-4 py-4 flex justify-between items-center"
        aria-label="Main Navigation"
      >
        {/* LOGO / BRAND */}
        <Link
          href="/"
          className="font-bold text-2xl text-gray-900 tracking-wide"
          aria-label="Deepak Khira Enterprises Home"
          prefetch
        >
          Deepak Khira Enterprises
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex space-x-8">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-base ${
                  pathname === link.href
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700 hover:text-blue-600 transition"
                }`}
                aria-current={pathname === link.href ? "page" : undefined}
                prefetch
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700"
          aria-label="Toggle Navigation Menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <HiOutlineX size={30} /> : <HiOutlineMenu size={30} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md transition-all">
          <ul className="flex flex-col px-6 py-4 space-y-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block text-base ${
                    pathname === link.href
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700 hover:text-blue-600 transition"
                  }`}
                  onClick={() => setIsOpen(false)}
                  prefetch
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
