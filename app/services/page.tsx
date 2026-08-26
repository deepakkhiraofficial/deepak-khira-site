import Script from "next/script";
import Link from "next/link";
import {
  FaArrowRight,
  FaCheckCircle,
  FaLaptopCode,
  FaShoppingCart,
  FaVideo,
  FaFileAlt,
  FaBullhorn,
  FaStore,
} from "react-icons/fa";

export const metadata = {
  title: "Our Services | Deepak Khira Enterprises",
  description:
    "Explore the professional business, e-commerce, digital, content and online selling services offered by Deepak Khira Enterprises.",

  keywords: [
    "Deepak Khira Enterprises services",
    "e-commerce services",
    "online selling services",
    "digital services",
    "web development",
    "video editing",
    "content creation",
    "resume building",
    "business services",
  ],

  alternates: {
    canonical: "/services",
  },

  openGraph: {
    title: "Our Services | Deepak Khira Enterprises",
    description:
      "Professional e-commerce, online selling and digital business services from Deepak Khira Enterprises.",
    url: "https://deepak-khira-enterprises.in/services",
    siteName: "Deepak Khira Enterprises",
    type: "website",
  },
};

const services = [
  {
    icon: FaShoppingCart,
    title: "E-Commerce & Online Selling",
    description:
      "Support for online product selling, product presentation, listings and e-commerce business operations.",
    features: [
      "Product listing support",
      "Online store management",
      "Product presentation",
      "E-commerce assistance",
    ],
  },

  {
    icon: FaLaptopCode,
    title: "Web Development",
    description:
      "Modern and responsive websites designed for businesses, brands and online stores.",
    features: [
      "Responsive websites",
      "Business websites",
      "E-commerce websites",
      "Modern UI development",
    ],
  },

  {
    icon: FaVideo,
    title: "Video Editing & Content",
    description:
      "Professional-looking promotional content and video editing for products, brands and businesses.",
    features: [
      "Product videos",
      "Promotional videos",
      "Short-form content",
      "Business creatives",
    ],
  },

  {
    icon: FaFileAlt,
    title: "Resume & Professional Documents",
    description:
      "Clean and professional resumes and business documents designed for better presentation.",
    features: [
      "Professional resumes",
      "CV formatting",
      "Document formatting",
      "Professional presentation",
    ],
  },

  {
    icon: FaBullhorn,
    title: "Digital & Promotional Support",
    description:
      "Digital support for businesses that want better product communication and online presentation.",
    features: [
      "Digital creatives",
      "Product promotion",
      "Content assistance",
      "Online presentation",
    ],
  },

  {
    icon: FaStore,
    title: "Business Support",
    description:
      "Practical digital and operational support for small businesses and online sellers.",
    features: [
      "Business assistance",
      "Online seller support",
      "Product-related support",
      "Digital solutions",
    ],
  },
];

export default function Services() {
  return (
    <>
      {/* =========================================================
          STRUCTURED DATA
      ========================================================== */}

      <Script
        id="services-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Services by Deepak Khira Enterprises",
            description:
              "Professional e-commerce, online selling and digital business services.",
            url: "https://deepak-khira-enterprises.in/services",
            itemListElement: services.map((service, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: service.title,
              description: service.description,
            })),
          }),
        }}
      />

      {/* =========================================================
          PAGE
      ========================================================== */}

      <div className="min-h-screen bg-white dark:bg-slate-950">
        {/* =======================================================
            HERO
        ======================================================== */}

        <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
          {/* Background decoration */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-blue-100/70 blur-3xl dark:bg-blue-950/20"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 -left-40 h-[320px] w-[320px] rounded-full bg-slate-200/60 blur-3xl dark:bg-slate-900"
          />

          <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <div className="mx-auto max-w-4xl text-center">
              {/* Eyebrow */}

              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 dark:border-blue-900/50 dark:bg-blue-950/30">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />

                <span className="text-xs font-bold uppercase tracking-[0.15em] text-blue-700 dark:text-blue-400">
                  Deepak Khira Enterprises
                </span>
              </div>

              {/* Heading */}

              <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl md:text-6xl dark:text-white">
                Professional services for
                <span className="block text-blue-600">modern businesses.</span>
              </h1>

              {/* Description */}

              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-400">
                From e-commerce and online selling to web development, content
                creation and professional digital support, we provide practical
                solutions for businesses and individuals.
              </p>

              {/* Buttons */}

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-600 dark:bg-white dark:text-slate-950 dark:hover:bg-blue-50"
                >
                  Discuss Your Requirement
                  <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 transition hover:border-blue-500 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:border-blue-500 dark:hover:text-blue-400"
                >
                  Explore Products
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =======================================================
            SERVICES
        ======================================================== */}

        <section className="bg-white py-16 sm:py-20 lg:py-24 dark:bg-slate-950">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            {/* Section heading */}

            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
                What We Offer
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
                Our Professional Services
              </h2>

              <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base dark:text-slate-400">
                Explore our range of services designed to support online
                sellers, businesses and individuals.
              </p>
            </div>

            {/* Services grid */}

            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const Icon = service.icon;

                return (
                  <article
                    key={service.title}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-blue-900"
                  >
                    {/* Icon */}

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-950/40 dark:text-blue-400 dark:group-hover:bg-blue-600 dark:group-hover:text-white">
                      <Icon className="text-lg" />
                    </div>

                    {/* Title */}

                    <h3 className="mt-5 text-lg font-bold text-slate-950 dark:text-white">
                      {service.title}
                    </h3>

                    {/* Description */}

                    <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {service.description}
                    </p>

                    {/* Features */}

                    <ul className="mt-5 space-y-2.5">
                      {service.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                        >
                          <FaCheckCircle className="mt-1 shrink-0 text-xs text-blue-600 dark:text-blue-400" />

                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* =======================================================
            WHY WORK WITH US
        ======================================================== */}

        <section className="border-y border-slate-200 bg-slate-50 py-16 dark:border-slate-800 dark:bg-slate-900/30">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              {/* Left */}

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
                  Our Approach
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
                  Simple, practical and business-focused.
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-7 text-slate-500 sm:text-base dark:text-slate-400">
                  Our focus is on delivering useful solutions that are easy to
                  understand, practical to implement and aligned with the actual
                  requirement.
                </p>
              </div>

              {/* Right */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  "Clear communication",
                  "Practical solutions",
                  "Professional presentation",
                  "Customer-focused approach",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <FaCheckCircle className="shrink-0 text-blue-600 dark:text-blue-400" />

                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =======================================================
            CTA
        ======================================================== */}

        <section className="bg-white py-16 dark:bg-slate-950">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <div className="relative overflow-hidden rounded-2xl bg-slate-950 px-6 py-10 text-center shadow-xl sm:px-10 sm:py-14">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-600/20 blur-3xl"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-blue-600/10 blur-3xl"
              />

              <div className="relative">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-400">
                  Let&apos;s Work Together
                </p>

                <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                  Have a requirement in mind?
                </h2>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400">
                  Contact us with your requirement and let&apos;s discuss the
                  right solution for you.
                </p>

                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-blue-50"
                  >
                    Contact Us
                    <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                  </Link>

                  <a
                    href="https://wa.me/919109001109?text=Hello%20Deepak%20Khira%20Enterprises%2C%20I%20have%20a%20service%20enquiry."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                  >
                    WhatsApp Enquiry
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
