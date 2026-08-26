"use client";

import React, { useState } from "react";
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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
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
      // NORMAL USER LOGIN
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

        console.error("Non-JSON login response:", text);

        throw new Error("Server returned an invalid response.");
      }

      const data: LoginResponse = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Invalid email or password.");
      }

      // ======================================================
      // CHECK ROLE
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

      // Unknown role
      throw new Error("Invalid account role.");
    } catch (error) {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center">Login</h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          Login to your account
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* EMAIL */}

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>

            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              disabled={loading}
            />
          </div>

          {/* PASSWORD */}

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>

            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </div>

          {/* LOGIN */}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Checking account..." : "Login"}
          </Button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-5">
          Your account type will be detected automatically.
        </p>
      </div>
    </div>
  );
}
