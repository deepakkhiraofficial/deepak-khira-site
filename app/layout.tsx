import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Deepak Khira Enterprises",
    template: "%s | Deepak Khira Enterprises",
  },
  description:
    "Trusted Online Seller, Professional business & digital services — web development, mobile apps, UI/UX, branding, and more.",
  keywords: [
    "Deepak Khira",
    "Deepak Kushwah",
    "web development",
    "UI UX",
    "business solutions",
    "software development",
    "online seller",
    "trading",
    "digital marketing",
    "freelancing",
    "professional services",
    "India",
    "Madhya Pradesh",
    "ecommerce",
    "branding",
  ],
  metadataBase: new URL("https://deepakkhiraenterprises.netlify.app/"),
  openGraph: {
    title: "Deepak Khira Enterprises",
    description:
      "Online Products • Trading • Digital Services • Content Creation. Trusted online seller from India.",
    url: "https://deepakkhiraenterprises.netlify.app/",
    siteName: "Deepak Khira Enterprises",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Deepak Khira Enterprises",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deepak Khira Enterprises",
    description:
      "Professional online services for web development, design, and business solutions.",
    images: [
      {
        url: "/twitter-image.jpg",
        width: 1200,
        height: 630,
        alt: "Deepak Khira Enterprises",
      },
    ],
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Chakra UI Color Mode Script */}
        <script
          id="chakra-script"
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var theme = localStorage.getItem("chakra-ui-color-mode") || "light";
                document.documentElement.style.setProperty("color-scheme", theme);
                document.documentElement.setAttribute("data-theme", theme);
              } catch(e){}
            })();`,
          }}
        />

        {/* Favicon & Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Deepak Khira Enterprises",
              url: "https://deepakkhiraenterprises.netlify.app/",
              logo: "/business_logo.png",
              sameAs: [
                "https://facebook.com/deepakkhiraofficial",
                "https://instagram.com/deepakkhiraofficial",
                "https://linkedin.com/in/mrdeepakkushwah",
              ],
            }),
          }}
        />
      </head>

      <body className={inter.className} suppressHydrationWarning>
        <Navbar />
        <Providers>{children}</Providers>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        <Footer />
      </body>
    </html>
  );
}
