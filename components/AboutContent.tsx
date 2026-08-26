"use client";

import Image from "next/image";
import Script from "next/script";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutContent() {
  // Animation Variants
  const fadeUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 },
  };

  const fadeLeft = {
    initial: { opacity: 0, x: -50 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 },
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const specializationCards = [
    {
      title: "Full Stack Development",
      desc: "Modern, scalable, secure web applications using React, Next.js, Node.js, and MongoDB.",
    },
    {
      title: "Business Websites",
      desc: "Professional, responsive, high-converting company websites with SEO optimization.",
    },
    {
      title: "Admin Dashboards",
      desc: "Dynamic dashboards with real-time updates, charts, analytics, and user management.",
    },
    {
      title: "Authentication Systems",
      desc: "Secure login, signup, JWT, OTP login, email verification, and full user management.",
    },
    {
      title: "E-commerce Features",
      desc: "Cart system, product management, orders, payments, stock sync, and more.",
    },
    {
      title: "UI/UX & Responsive Design",
      desc: "Clean, modern, animated, and highly responsive design for all devices.",
    },
  ];

  return (
    <section className="relative bg-gradient-to-b from-blue-900 via-navy-900 to-blue-800 text-white py-24 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      {/* SEO JSON-LD */}
      <Script
        type="application/ld+json"
        id="about-schema"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Deepak Khira Enterprises",
            url: "https://deepakkhiraenterprises.netlify.app",
            logo: "/business_logo.png",
            sameAs: [
              "https://www.linkedin.com/in/deepakkhiraofficial/",
              "https://github.com/deepakkhiraofficial",
              "https://facebook.com/deepakkhiraofficial",
              "https://instagram.com/deepakkhiraofficial",
              "https://x.com/DeepakKhira",
              "https://www.youtube.com/@deepakkhiraofficial",
            ],
            founder: {
              "@type": "Person",
              name: "Deepak Kushwah",
            },
          }),
        }}
      />

      <div className="max-w-7xl mx-auto space-y-32">
        {/* HEADER */}
        <motion.div {...fadeUp} className="text-center space-y-6">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold drop-shadow-lg">
            About Us
          </h1>
          <p className="text-gray-100 text-lg sm:text-xl max-w-3xl mx-auto drop-shadow-sm">
            Deepak Khira Enterprises is built on innovation, integrity, and
            impact — creating modern digital solutions that truly transform
            businesses and empower brands.
          </p>
        </motion.div>

        {/* COMPANY OVERVIEW */}
        <motion.div
          {...fadeLeft}
          className="grid md:grid-cols-2 gap-12 items-center bg-white/5 p-8 rounded-3xl backdrop-blur-md shadow-lg border border-white/20"
        >
          <Image
            src="/images/card.png"
            alt="About Deepak Khira Enterprises"
            width={500}
            height={500}
            className="rounded-3xl shadow-2xl w-full h-80 object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold drop-shadow-md">
              Who We Are
            </h2>
            <p className="leading-relaxed text-gray-100">
              We are a modern digital solutions company focused on delivering
              world-class web applications, business websites, dashboards, and
              high-performance software systems. Led by{" "}
              <strong>Deepak Kushwah</strong>, a passionate Full Stack
              Developer, we combine clean UI, strong backend architecture, and
              seamless user experiences.
            </p>
            <p className="leading-relaxed text-gray-100">
              From authentication systems to admin dashboards, real-time apps,
              and professional business platforms — we build powerful systems
              that scale and generate measurable results for clients.
            </p>
          </div>
        </motion.div>

        {/* SPECIALIZATIONS */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={staggerContainer}
          viewport={{ once: true }}
          className="space-y-10"
        >
          <h2 className="text-3xl font-semibold text-center drop-shadow-md">
            What We Do
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {specializationCards.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.1 }}
                className="p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-md border border-white/20 hover:shadow-xl transition"
              >
                <h3 className="text-xl font-semibold mb-2 drop-shadow-sm">
                  {item.title}
                </h3>
                <p className="text-gray-100 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FOUNDER SECTION */}
        <motion.div
          {...fadeLeft}
          className="grid md:grid-cols-2 gap-12 items-center bg-white/5 p-10 rounded-3xl shadow-xl border border-white/20 backdrop-blur-md"
        >
          <Image
            src="/images/card.png"
            alt="Deepak Kushwah"
            width={500}
            height={500}
            className="rounded-2xl w-full h-80 object-cover shadow-md"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="space-y-4">
            <h2 className="text-3xl font-bold drop-shadow-md">
              Deepak Kushwah
            </h2>
            <p className="text-indigo-400 font-medium mb-4">
              Full Stack Developer & Founder
            </p>
            <p className="text-gray-100 leading-relaxed">
              With expertise in modern JavaScript frameworks, backend systems,
              authentication, admin dashboards, and high-performance UI, Deepak
              has built dozens of scalable, real-world applications.
            </p>
            <p className="text-gray-100 leading-relaxed mt-4">
              His focus: delivering premium-quality code, beautiful UI, smooth
              UX, and reliable backend systems that work flawlessly in
              production.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <a
                href="https://www.linkedin.com/in/deepakkhiraofficial/"
                className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/deepakkhiraofficial"
                className="px-5 py-2 bg-gray-900 text-white rounded-xl hover:bg-black"
              >
                GitHub
              </a>
              <a
                href="mailto:deepakkushwah475110@gmail.com"
                className="px-5 py-2 bg-gray-200 text-gray-900 rounded-xl hover:bg-gray-300"
              >
                Contact
              </a>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div {...fadeUp} className="text-center mt-20">
          <h2 className="text-3xl font-bold mb-4 drop-shadow-md">
            Let’s Build Something Amazing
          </h2>
          <p className="text-gray-100 mb-6">
            Whether it&apos;s a business website, admin system, or complete web
            application — we can build it.
          </p>
          <Link
            href="/contact"
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 text-lg transition"
          >
            Contact Us
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
