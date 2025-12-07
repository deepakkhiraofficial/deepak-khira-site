"use client";

import { useState } from "react";
import { FiCheckCircle, FiUser, FiMail, FiMessageSquare } from "react-icons/fi";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import { toast } from "react-toastify";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Invalid email address";
    if (!message.trim()) newErrors.message = "Message cannot be empty";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      // toast.success("Message sent successfully!");
      const data = await res.json();
      console.log(data)
      if (res.ok) {
        toast.success("Message sent successfully!");
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
        setErrors({});
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const inputClasses =
    "peer block w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-10 pt-5 pb-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition";
  const labelClasses =
    "absolute left-10 top-2 text-gray-500 dark:text-gray-400 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500";

  return (
    <main className="relative lg-h-screen  from-blue-100 via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col justify-center items-center px-6 md:px-16">
      {/* Background pattern */}
      {/* <div className="absolute inset-0 bg-[url('/contact-bg.png')] bg-no-repeat bg-center bg-cover opacity-10 dark:opacity-20 -z-10"></div> */}

      {/* Contact Form Card */}
      <section className="relative max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10 flex flex-col gap-6 animate-fade-in">
        {status === "success" ? (
          <div className="flex flex-col items-center text-center">
            <FiCheckCircle className="text-green-500 w-16 h-16 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Message Sent!
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Thank you for contacting us. We will get back to you shortly.
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

            {/* Name */}
            <div className="relative">
              <FiUser className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <input
                type="text"
                id="name"
                placeholder=" "
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`${inputClasses} ${errors.name ? "border-red-500" : ""}`}
              />
              <label htmlFor="name" className={labelClasses}>
                Name
              </label>
              {errors.name && (
                <span className="text-red-500 text-sm mt-1 absolute bottom-[-1.25rem] left-0">
                  {errors.name}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="relative">
              <FiMail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <input
                type="email"
                id="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${inputClasses} ${errors.email ? "border-red-500" : ""}`}
              />
              <label htmlFor="email" className={labelClasses}>
                Email
              </label>
              {errors.email && (
                <span className="text-red-500 text-sm mt-1 absolute bottom-[-1.25rem] left-0">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Message */}
            <div className="relative">
              <FiMessageSquare className="absolute top-3 left-3 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <textarea
                id="message"
                placeholder=" "
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`${inputClasses} h-32 resize-none ${errors.message ? "border-red-500" : ""}`}
              />
              <label htmlFor="message" className={labelClasses}>
                Message
              </label>
              {errors.message && (
                <span className="text-red-500 text-sm mt-1 absolute bottom-[-1.25rem] left-0">
                  {errors.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === "sending"}
              className="group relative w-full inline-flex items-center justify-center overflow-hidden rounded-2xl bg-blue-600 px-6 py-3 text-white font-medium transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative">
                {status === "sending" ? "Sending..." : "Send Message"}
              </span>
            </button>

            {status === "error" && (
              <p className="text-red-500 text-center mt-2">
                ❌ Failed to send message. Please try again.
              </p>
            )}
          </form>
        )}
      </section>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/9109001109"
        target="_blank"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-xl text-3xl hover:bg-green-600 transition"
      >
        🟢
      </a>

      {/* Tailwind animations */}
      <style>
        {`
          @keyframes fade-in {
            0% { opacity: 0; transform: translateY(-20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        `}
      </style>
    </main>
  );
}
