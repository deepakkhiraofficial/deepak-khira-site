"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Bell, ChevronDown, LogOut, Search } from "lucide-react";



export default function DashboardPage() {
  const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="mb-6">Welcome, USER!</p>
      <button
                                         type="button"
                                         disabled={loggingOut}
                                         onClick={logout}
                                         className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                     >
                                         <LogOut size={16} />

                                         {loggingOut
                                             ? "Signing out..."
                                             : "Sign out"}
                                     </button>

    </div>
  );
}
