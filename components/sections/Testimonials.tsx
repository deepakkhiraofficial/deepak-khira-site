"use client";

import { useState, useEffect } from "react";

interface Testimonial {
  name: string;
  role: string;
  message: string;
  avatar?: string;
}

export default function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      name: "John Doe",
      role: "CEO, Company A",
      message:
        "Deepak Khira Enterprises delivered excellent services, highly recommend!",
      avatar: "/images/avatar1.jpg",
    },
    {
      name: "Jane Smith",
      role: "Product Manager, Company B",
      message: "Professional team, fast delivery, and top-notch quality.",
      avatar: "/images/avatar2.jpg",
    },
    {
      name: "Alice Johnson",
      role: "CTO, Startup C",
      message: "Their solutions helped scale our business efficiently.",
      avatar: "/images/avatar3.jpg",
    },
  ];

  const [current, setCurrent] = useState(0);

  // Auto-slide testimonials every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section
      id="testimonials"
      className="py-24 bg-gray-50 dark:bg-gray-900"
      aria-labelledby="testimonials-heading"
    >
      <div className="container mx-auto px-6 md:px-16">
        <h2
          id="testimonials-heading"
          className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-16 animate-fade-in"
        >
          What Our Clients Say
        </h2>

        {/* Testimonial Cards */}
        <div className="relative flex overflow-hidden">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className={`min-w-full p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 transition-transform duration-700 ease-in-out transform ${
                idx === current
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0 absolute top-0 left-0"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                {t.avatar && (
                  <img
                    src={t.avatar}
                    alt={`${t.name} avatar`}
                    className="w-20 h-20 rounded-full mb-4 object-cover shadow-md"
                  />
                )}
                <p className="mb-6 text-gray-700 dark:text-gray-300 text-lg">
                  "{t.message}"
                </p>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t.role}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center mt-8 space-x-3">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === current
                  ? "bg-blue-600 dark:bg-blue-400"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Fade-in Animation */}
      <style>
        {`
          @keyframes fade-in {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.8s ease-out forwards;
          }
        `}
      </style>
    </section>
  );
}
