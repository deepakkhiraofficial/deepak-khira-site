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

// CURRENT LIVE WEBSITE
const SITE_URL = "https://deepakkhiraenterprises.netlify.app";

const SITE_NAME = "Deepak Khira Enterprises";

const SITE_DESCRIPTION =
  "Deepak Khira Enterprises provides quality products, digital services, web development, branding, and business solutions for customers and businesses across India.";

// ============================================================
// METADATA
// ============================================================

export const metadata: Metadata = {
  // ----------------------------------------------------------
  // BASE URL
  // ----------------------------------------------------------

  metadataBase: new URL(SITE_URL),

  // ----------------------------------------------------------
  // TITLE
  // ----------------------------------------------------------

  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },

  // ----------------------------------------------------------
  // DESCRIPTION
  // ----------------------------------------------------------

  description: SITE_DESCRIPTION,

  applicationName: SITE_NAME,

  // ----------------------------------------------------------
  // KEYWORDS
  // ----------------------------------------------------------

  keywords: [
    "Deepak Khira Enterprises",
    "Deepak Khira",
    "Deepak Khira Enterprises India",
    "Deepak Khira products",
    "online shopping India",
    "online products India",
    "e-commerce India",
    "digital services India",
    "web development India",
    "website development",
    "branding services",
    "business solutions India",
    "quality products India",
  ],

  // ----------------------------------------------------------
  // AUTHOR
  // ----------------------------------------------------------

  authors: [
    {
      name: SITE_NAME,
      url: SITE_URL,
    },
  ],

  creator: SITE_NAME,
  publisher: SITE_NAME,

  // ----------------------------------------------------------
  // GOOGLE SEARCH CONSOLE VERIFICATION
  // ----------------------------------------------------------

  verification: {
    google: "w82R7WzR0qzxSW09B13a2lToFEPFSOjkp7-U9SEIPMc",
  },

  // ----------------------------------------------------------
  // CANONICAL
  // ----------------------------------------------------------

  alternates: {
    canonical: "/",
  },

  // ----------------------------------------------------------
  // ROBOTS / SEARCH ENGINE INDEXING
  // ----------------------------------------------------------

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

  // ----------------------------------------------------------
  // ICONS
  // ----------------------------------------------------------

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

  // ----------------------------------------------------------
  // WEB APP MANIFEST
  // ----------------------------------------------------------

  manifest: "/manifest.webmanifest",

  // ----------------------------------------------------------
  // OPEN GRAPH
  // ----------------------------------------------------------

  openGraph: {
    type: "website",

    locale: "en_IN",

    url: SITE_URL,

    siteName: SITE_NAME,

    title: SITE_NAME,

    description: SITE_DESCRIPTION,

    images: [
      {
        url: `${SITE_URL}/business_logo.png`,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },

  // ----------------------------------------------------------
  // TWITTER / X
  // ----------------------------------------------------------

  twitter: {
    card: "summary_large_image",

    title: SITE_NAME,

    description: SITE_DESCRIPTION,

    images: [`${SITE_URL}/business_logo.png`],
  },

  // ----------------------------------------------------------
  // CATEGORY
  // ----------------------------------------------------------

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
          {/* ==================================================
              GLOBAL NAVBAR
          ================================================== */}

          <Navbar />

          {/* ==================================================
              PAGE CONTENT
          ================================================== */}

          <main className="min-h-screen pt-20">{children}</main>

          {/* ==================================================
              GLOBAL FOOTER
          ================================================== */}

          <Footer />

          {/* ==================================================
              GLOBAL TOAST
          ================================================== */}

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
