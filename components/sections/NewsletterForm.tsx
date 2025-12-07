"use client";
import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "" | "subscribing" | "success" | "error"
  >("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("subscribing");
    setMessage("Subscribing...");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setStatus("success");
        setMessage("Subscribed successfully! 🎉");
        setEmail("");
      } else {
        setStatus("error");
        setMessage("Failed to subscribe. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Error subscribing. Please try again later.");
    }
  };

  // Status color based on state
  const statusColor = {
    subscribing: "text-blue-600",
    success: "text-green-600",
    error: "text-red-600",
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Subscribe to our Newsletter
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Get the latest updates and offers directly in your inbox.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row justify-center gap-4 items-center"
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="p-3 border border-gray-300 dark:border-gray-700 rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === "subscribing"}
          />
          <button
            type="submit"
            className={`px-6 py-3 rounded-lg font-medium text-white transition transform ${
              status === "subscribing"
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-1"
            }`}
            disabled={status === "subscribing"}
          >
            {status === "subscribing" ? "Subscribing..." : "Subscribe"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-lg font-medium transition-all ${statusColor[status as keyof typeof statusColor]}`}
          >
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
