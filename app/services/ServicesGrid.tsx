"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const servicesData = [
  {
    title: "Trading Services",
    description:
      "Professional trading solutions with expert guidance and insights to maximize profits.",
    icon: "/icons/trading.png",
  },
  {
    title: "Online Selling",
    description:
      "We help entrepreneurs sell online efficiently with optimized listings, marketing, and delivery.",
    icon: "/icons/selling.webp",
  },
  {
    title: "Content Creation",
    description:
      "Engaging content creation services for blogs, social media, and marketing campaigns.",
    icon: "/icons/content.jpg",
  },
  {
    title: "Video Editing",
    description:
      "High-quality video editing services for YouTube, social media, and corporate projects.",
    icon: "/icons/Video.jpeg",
  },
  {
    title: "Resume Building",
    description:
      "Professional resume writing and LinkedIn optimization to help you land your dream job.",
    icon: "/icons/Resume.jpg",
  },
  {
    title: "Review Services",
    description:
      "Honest and detailed product or service reviews to boost credibility and trust online.",
    icon: "/icons/Review Services.webp",
  },
];

export default function ServicesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl w-full">
      {servicesData.map((service, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all flex flex-col items-center text-center"
        >
          <Image
            src={service.icon}
            alt={service.title}
            width={100}
            height={100}
            className="mb-4"
          />

          <h3 className="text-xl font-bold mb-2 text-blue-700 dark:text-blue-400">
            {service.title}
          </h3>

          <p className="text-gray-600 dark:text-gray-300 text-base">
            {service.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
