import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartContext";
import { Toaster } from "react-hot-toast";

import "react-toastify/dist/ReactToastify.css";

// ============================================================
// FONT
// ============================================================

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// ============================================================
// SITE CONFIG
// ============================================================

const SITE_URL = "https://deepak-khira-enterprises.in";

const SITE_NAME = "Deepak Khira Enterprises";

const SITE_DESCRIPTION =
  "Deepak Khira Enterprises provides online products, digital services, web development, branding, and business solutions for customers and businesses.";

// ============================================================
// METADATA
// ============================================================

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },

  description: SITE_DESCRIPTION,

  applicationName: SITE_NAME,

  keywords: [
    "Deepak Khira Enterprises",
    "Deepak Khira",
    "online seller India",
    "e-commerce India",
    "digital services",
    "web development",
    "website development",
    "branding services",
    "business solutions",
    "online shopping",
  ],

  authors: [
    {
      name: SITE_NAME,
      url: SITE_URL,
    },
  ],

  creator: SITE_NAME,
  publisher: SITE_NAME,

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
      {
        url: "/logo.png",
        type: "image/png",
      },
    ],

    apple: [
      {
        url: "/logo.png",
        type: "image/png",
      },
    ],
  },

  manifest: "/manifest.webmanifest",

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,

    images: [
      {
        url: "/business_logo.png",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/business_logo.png"],
  },

  category: "business",
};

// ============================================================
// VIEWPORT
// ============================================================

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,

  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#ffffff",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "#020617",
    },
  ],
};

// ============================================================
// ROOT LAYOUT
// ============================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${inter.className} bg-white text-gray-900 antialiased dark:bg-slate-950 dark:text-white`}
      >
        <CartProvider>
          {/* GLOBAL NAVBAR */}
          <Navbar />

          {/* PAGE CONTENT */}
          <main className="min-h-screen pt-20">{children}</main>

          {/* GLOBAL FOOTER */}
          <Footer />

          {/* GLOBAL TOAST */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,

              success: {
                style: {
                  background: "#0f172a",
                  color: "#ffffff",
                  border: "1px solid #1e293b",
                },
              },

              error: {
                style: {
                  background: "#0f172a",
                  color: "#ffffff",
                  border: "1px solid #334155",
                },
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
