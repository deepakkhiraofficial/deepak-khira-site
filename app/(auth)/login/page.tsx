"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type LoginResponse = {
  success: boolean;
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: "user" | "admin";
  };
};

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    // ========================================================
    // VALIDATION
    // ========================================================

    if (!cleanEmail || !password) {
      toast.error("Please enter email and password.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      // ======================================================
      // LOGIN API
      // ======================================================

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: cleanEmail,
          password,
        }),
      });

      const contentType = res.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        const text = await res.text();

        console.error("NON-JSON LOGIN RESPONSE:", text);

        throw new Error("Server returned an invalid response.");
      }

      const data: LoginResponse = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Invalid email or password.");
      }

      // ======================================================
      // CHECK USER ROLE
      // ======================================================

      const role = data.user?.role;

      if (!role) {
        throw new Error("Login successful but user role was not returned.");
      }

      toast.success(data.message || "Login successful!");

      // ======================================================
      // ROLE BASED REDIRECT
      // ======================================================

      if (role === "admin") {
        router.replace("/admin/dashboard");
        return;
      }

      if (role === "user") {
        router.replace("/dashboard");
        return;
      }

      throw new Error("Invalid account role.");
    } catch (error: unknown) {
      console.error("LOGIN ERROR:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 dark:bg-slate-950">
      <section className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Login to your Deepak Khira Enterprises account
            </p>
          </div>

          {/* ==================================================
              LOGIN FORM
          ================================================== */}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* EMAIL */}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
              >
                Email Address
              </label>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                autoComplete="email"
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            {/* PASSWORD */}

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
              >
                Password
              </label>

              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                autoComplete="current-password"
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            {/* LOGIN BUTTON */}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Checking account..." : "Login"}
            </Button>
          </form>

          {/* ==================================================
              SIGNUP
          ================================================== */}

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400"
            >
              Create an account
            </Link>
          </p>

          {/* ==================================================
              ACCOUNT TYPE
          ================================================== */}

          <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
            Your account type will be detected automatically.
          </p>
        </div>
      </section>
    </main>
  );
}
