"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Check if admin token exists
  useEffect(() => {
    const token = Cookies.get("admin-token");
    if (!token) router.push("/admin/login");
  }, [router]);

  const handleLogout = () => {
    Cookies.remove("admin-token");
    router.push("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white hidden md:flex flex-col">
        <div className="p-6 font-bold text-xl border-b border-gray-700">
          Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/admin"
            className="block py-2 px-3 hover:bg-gray-700 rounded"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="block py-2 px-3 hover:bg-gray-700 rounded"
          >
            Products
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left py-2 px-3 hover:bg-gray-700 rounded text-red-500"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Mobile toggle */}
      <div className="md:hidden absolute top-4 left-4 z-50">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <HiOutlineX size={28} /> : <HiOutlineMenu size={28} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <aside className="absolute top-0 left-0 w-64 h-full bg-gray-800 text-white z-50 flex flex-col">
          <div className="p-6 font-bold text-xl border-b border-gray-700">
            Admin Panel
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <Link
              href="/admin"
              className="block py-2 px-3 hover:bg-gray-700 rounded"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="block py-2 px-3 hover:bg-gray-700 rounded"
            >
              Products
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left py-2 px-3 hover:bg-gray-700 rounded text-red-500"
            >
              Logout
            </button>
          </nav>
        </aside>
      )}

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
