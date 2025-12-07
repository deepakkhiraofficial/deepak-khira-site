import Script from "next/script";
import ServicesGrid from "./ServicesGrid";

export const metadata = {
  title:
    "Our Services – Deepak Khira Enterprises | Online Seller & Digital Solutions",
  description:
    "Deepak Khira Enterprises offers professional services including trading, online selling, content creation, video editing, resume building, and review services.",
};

export default function Services() {
  return (
    <>
      {/* ORGANIZATION SCHEMA */}
      <Script
        id="org-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Deepak Khira Enterprises",
            url: "https://deepakkhiraenterprises.netlify.app",
            logo: "/business_logo.png",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+91-9109001109",
              contactType: "Customer Support",
            },
          }),
        }}
      />

      <main
        className="relative min-h-screen bg-gradient-to-br 
        from-blue-50 via-blue-100 to-blue-50 
        dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 
        py-24 px-6 md:px-16 flex flex-col items-center"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold text-blue-700 dark:text-blue-400 text-center mb-12">
          Our Professional Services
        </h1>

        <p className="text-center max-w-3xl text-gray-700 dark:text-gray-300 text-lg md:text-xl mb-16">
          Deepak Khira Enterprises provides premium services including trading,
          online selling, content creation, video editing, resume building, and
          review services.
        </p>

        {/* FIXED CLIENT COMPONENT FOR ANIMATIONS */}
        <ServicesGrid />
      </main>
    </>
  );
}
