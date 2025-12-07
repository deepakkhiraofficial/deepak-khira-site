"use client";

import ServicesGrid from "@/components/sections/ServicesGrid";

export default function Services() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 px-6 md:px-16 flex flex-col items-center">
      {/* Subtle background image for SaaS premium effect */}
      <div className="absolute inset-0 bg-[url('/services-bg.png')] bg-no-repeat bg-center bg-cover opacity-10 dark:opacity-20 -z-10"></div>

      {/* Services Grid */}
      <ServicesGrid />

      {/* Tailwind animations */}
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
    </main>
  );
}
