"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [checkingAuth, setCheckingAuth] = useState(true);

  // ============================================================
  // ADMIN LOGIN PAGE
  // ============================================================

  const isLoginPage =
    pathname === "/admin/login" || pathname === "/admin/login/";

  // ============================================================
  // ADMIN AUTH CHECK
  // ============================================================

  useEffect(() => {
    let mounted = true;

    // IMPORTANT:
    // /admin/login is a PUBLIC page.
    // It must NEVER call /api/auth/me.
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    const checkAdmin = async () => {
      try {
        setCheckingAuth(true);

        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          if (mounted) {
            router.replace("/admin/login");
          }

          return;
        }

        const data = await response.json();

        console.log("ADMIN AUTH RESPONSE:", data);

        const user = data?.user || data?.data?.user || data?.data;

        if (!data?.success || !user || user.role !== "admin") {
          if (mounted) {
            router.replace("/admin/login");
          }

          return;
        }

        if (mounted) {
          setCheckingAuth(false);
        }
      } catch (error) {
        console.error("Admin auth check failed:", error);

        if (mounted) {
          router.replace("/admin/login");
        }
      }
    };

    checkAdmin();

    return () => {
      mounted = false;
    };
  }, [router, isLoginPage]);

  // ============================================================
  // LOGIN PAGE
  // ============================================================

  // VERY IMPORTANT:
  // Login page should render immediately.
  //
  // No sidebar
  // No admin auth loading
  // No /api/auth/me
  // No redirect

  if (isLoginPage) {
    return <>{children}</>;
  }

  // ============================================================
  // ADMIN AUTH LOADING
  // ============================================================

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="text-sm font-medium text-slate-500">
            Loading admin panel...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ADMIN PANEL
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-50">
      {/* SIDEBAR */}

      <Sidebar />

      {/* MAIN CONTENT */}

      <main
        className="
          min-h-screen
          pt-16
          lg:ml-[270px]
          lg:pt-0
        "
      >
        <div
          className="
            min-h-screen
            px-4
            py-6
            sm:px-6
            lg:px-8
            lg:py-8
          "
        >
          {children}
        </div>
      </main>
    </div>
  );
}
