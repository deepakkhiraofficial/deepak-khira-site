import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "About Us | Deepak Khira Enterprises",
    template: "%s | Deepak Khira Enterprises",
  },
  description:
    "Learn about Deepak Khira Enterprises — a trusted digital solutions company offering web development, admin dashboards, e-commerce solutions, and business services.",
  keywords: [
    "Deepak Khira",
    "Deepak Kushwah",
    "About Us",
    "digital solutions",
    "web development",
    "UI/UX design",
    "software development",
    "business solutions",
    "online seller",
    "e-commerce",
    "admin dashboards",
    "full stack developer",
    "India",
    "Madhya Pradesh",
    "Deepak Khira Enterprises",
  ],
  metadataBase: new URL("https://deepakkhiraenterprises.netlify.app/"),
  openGraph: {
    title: "About Us | Deepak Khira Enterprises",
    description:
      "Discover the team, expertise, and mission behind Deepak Khira Enterprises. Trusted online seller and professional digital solutions provider from India.",
    url: "https://deepakkhiraenterprises.netlify.app/about",
    siteName: "Deepak Khira Enterprises",
    images: [
      {
        url: "/og-about.jpg",
        width: 1200,
        height: 630,
        alt: "About Deepak Khira Enterprises",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Deepak Khira Enterprises",
    description:
      "Learn about Deepak Khira Enterprises, a trusted online seller and provider of premium web and software solutions.",
    images: ["/twitter-about.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://deepakkhiraenterprises.netlify.app/about",
  },
};

export default function About() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-indigo-700">About Us</h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Deepak Khira Enterprises is built on innovation, integrity, and
            impact — creating modern digital solutions that truly transform
            businesses.
          </p>
        </div>

        {/* COMPANY OVERVIEW */}
        <div className="grid md:grid-cols-2 gap-10 mb-20 items-center">
          <Image
            src="/images/card.png"
            alt="About Deepak Khira Enterprises"
            className="rounded-3xl shadow-xl w-full object-cover h-80"
            width={500}
            height={500}
          />
          <div>
            <h2 className="text-3xl font-semibold mb-4">Who We Are</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              We are a modern digital solutions company focused on delivering
              world-class web applications, business websites, dashboards, and
              high-performance software systems. Led by{" "}
              <strong>Deepak Kushwah</strong>, a passionate Full Stack
              Developer, we combine clean UI, strong backend architecture, and
              seamless user experiences.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mt-4">
              From authentication systems to admin dashboards, real-time apps,
              and professional business platforms — we build powerful systems
              that scale.
            </p>
          </div>
        </div>

        {/* SPECIALIZATIONS */}
        <div className="mb-20">
          <h2 className="text-3xl font-semibold text-center mb-10">
            What We Do
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Full Stack Development",
                desc: "Modern, scalable and secure web applications using React, Next.js, Node.js, and MongoDB.",
              },
              {
                title: "Business Websites",
                desc: "Professional, responsive and high-converting company websites with SEO optimization.",
              },
              {
                title: "Admin Dashboards",
                desc: "Fully dynamic dashboards with real-time updates, charts, analytics and user management.",
              },
              {
                title: "Authentication Systems",
                desc: "Secure login, signup, JWT, OTP login, email verification and complete user management.",
              },
              {
                title: "E-commerce Features",
                desc: "Cart system, product management, orders, payments, stock sync and more.",
              },
              {
                title: "UI/UX & Responsive Design",
                desc: "Clean, modern, animated and highly responsive design for all devices.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition border"
              >
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FOUNDER SECTION */}
        <div className="bg-white p-10 rounded-3xl shadow-xl border mb-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <Image
              src="/images/card.png"
              alt="Deepak Kushwah"
              className="rounded-2xl w-full h-80 object-cover shadow-md"
              width={500}
              height={500}
            />

            <div>
              <h2 className="text-3xl font-bold mb-2">Deepak Kushwah</h2>
              <p className="text-indigo-600 font-medium mb-4">
                Full Stack Developer & Founder
              </p>

              <p className="text-gray-600 text-lg leading-relaxed">
                With expertise in modern JavaScript frameworks, backend systems,
                authentication, admin dashboards, and high-performance UI,
                Deepak has built dozens of scalable, real-world applications.
              </p>

              <p className="text-gray-600 text-lg mt-4 leading-relaxed">
                His focus: delivering premium-quality code, beautiful UI, smooth
                UX, and reliable backend systems that work flawlessly in
                production.
              </p>

              <div className="flex gap-4 mt-6">
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
                  className="px-5 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* VALUES */}
        <div className="mb-20">
          <h2 className="text-3xl font-semibold text-center mb-10">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Integrity",
                desc: "We maintain honesty, transparency and trust in every project.",
              },
              {
                title: "Innovation",
                desc: "We use modern technologies to create future-ready solutions.",
              },
              {
                title: "Impact",
                desc: "We build products that make a real difference for businesses.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-2xl shadow-md border"
              >
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CALL TO ACTION */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold mb-4">
            Let’s Build Something Amazing
          </h2>
          <p className="text-gray-600 mb-6">
            Whether it's a business website, admin system, or complete web
            application — we can build it.
          </p>
          <a
            href="/contact"
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 text-lg"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}
