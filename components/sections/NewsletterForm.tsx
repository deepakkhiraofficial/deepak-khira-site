"use client";
import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Subscribing...");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setStatus("Subscribed successfully!");
        setEmail("");
      } else {
        setStatus("Failed to subscribe.");
      }
    } catch (err) {
      setStatus("Error subscribing.");
    }
  };

  return (
    <section className="bg-gray-100 py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Subscribe to our Newsletter</h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row justify-center gap-4 mt-6"
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="p-3 border rounded w-full md:w-1/3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
          >
            Subscribe
          </button>
        </form>
        {status && <p className="mt-4">{status}</p>}
      </div>
    </section>
  );
}
