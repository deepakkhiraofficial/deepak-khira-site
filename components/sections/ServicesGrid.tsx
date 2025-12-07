"use client";

import { FaLaptopCode, FaMobileAlt, FaPalette } from "react-icons/fa";

export default function ServicesGrid() {
  const services = [
    {
      title: "Web Development",
      desc: "Professional and scalable web solutions for your business.",
      icon: <FaLaptopCode />,
      gradient:
        "bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-700 dark:to-blue-500",
    },
    {
      title: "Mobile Apps",
      desc: "iOS & Android apps tailored for your needs.",
      icon: <FaMobileAlt />,
      gradient:
        "bg-gradient-to-br from-green-400 to-green-600 dark:from-green-700 dark:to-green-500",
    },
    {
      title: "UI/UX Design",
      desc: "Modern, user-friendly designs that engage users.",
      icon: <FaPalette />,
      gradient:
        "bg-gradient-to-br from-pink-400 to-pink-600 dark:from-pink-700 dark:to-pink-500",
    },
  ];

  return (
    <section id="services" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-16 animate-fade-in">
          Our Services
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`relative rounded-2xl shadow-2xl overflow-hidden p-8 flex flex-col items-center text-center transform transition-transform duration-500 hover:-translate-y-3 hover:shadow-3xl animate-fade-in`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Gradient circle icon */}
              <div
                className={`w-20 h-20 flex items-center justify-center rounded-full mb-6 text-white text-3xl ${service.gradient} shadow-lg`}
              >
                {service.icon}
              </div>

              <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                {service.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{service.desc}</p>

              {/* Optional subtle gradient overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/10 to-white/5 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>

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
    </section>
  );
}
