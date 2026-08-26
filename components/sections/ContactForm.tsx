"use client";

import { useState, useEffect } from "react";
import { FiCheckCircle, FiUser, FiMail, FiMessageSquare } from "react-icons/fi";
import { toast } from "react-toastify";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errors, setErrors] = useState({ name: "", email: "", message: "" });

  // trigger confetti when status becomes success
  useEffect(() => {
    if (status === "success") {
      (async () => {
        try {
          const confetti = (await import("canvas-confetti")).default;
          // burst
          confetti({
            particleCount: 60,
            spread: 60,
            origin: { x: 0.5, y: 0.3 },
          });
          // slow shower
          confetti({
            particleCount: 120,
            spread: 120,
            startVelocity: 20,
            gravity: 0.6,
            ticks: 250,
            origin: { x: 0.5, y: 0.0 },
          });
        } catch (e) {
          // ignore if confetti import fails
          console.warn("Confetti failed", e);
        }
      })();
    }
  }, [status]);

  const validate = () => {
    const newErrors: any = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    else if (form.name.trim().length < 3)
      newErrors.name = "Name must be at least 3 chars.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter valid email.";
    if (!form.message.trim()) newErrors.message = "Message cannot be empty.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to send message.");
        setStatus("error");
        return;
      }
      toast.success("Message sent successfully!");
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
      setErrors({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const inputBase =
    "peer block w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-10 pt-5 pb-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition";
  const labelBase =
    "absolute left-10 top-2 text-gray-500 dark:text-gray-400 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500";

  return (
    <main className="relative lg-h-screen flex flex-col justify-center items-center px-6 md:px-16">
      <section className="relative max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10 flex flex-col gap-6 animate-fade-in">
        {status === "success" ? (
          <div className="flex flex-col items-center text-center">
            <FiCheckCircle className="text-green-500 w-16 h-16 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Message Sent!
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Thanks — we will contact you soon.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
            >
              Send Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
              Contact Us
            </h2>

            <div className="relative">
              <FiUser className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder=" "
                className={`${inputBase} ${errors.name ? "border-red-500" : ""}`}
              />
              <label className={labelBase}>Name</label>
              {errors.name && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.name}
                </span>
              )}
            </div>

            <div className="relative">
              <FiMail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder=" "
                className={`${inputBase} ${errors.email ? "border-red-500" : ""}`}
              />
              <label className={labelBase}>Email</label>
              {errors.email && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="relative">
              <FiMessageSquare className="absolute top-3 left-3 text-gray-400 w-5 h-5" />
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder=" "
                className={`${inputBase} h-32 resize-none ${errors.message ? "border-red-500" : ""}`}
              />
              <label className={labelBase}>Message</label>
              {errors.message && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-white font-medium transition-all hover:bg-blue-700 disabled:opacity-50"
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>

            {status === "error" && (
              <p className="text-red-500 text-center">
                ❌ Failed to send message. Please try again.
              </p>
            )}
          </form>
        )}
      </section>

      <a
        href="https://wa.me/9109001109"
        target="_blank"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-xl text-3xl hover:bg-green-600 transition"
      >
        🟢
      </a>

      <style>{`@keyframes fade-in {0%{opacity:0;transform:translateY(-20px);}100%{opacity:1;transform:translateY(0);} } .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }`}</style>
    </main>
  );
}
