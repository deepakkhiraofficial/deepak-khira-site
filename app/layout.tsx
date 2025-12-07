import './globals.css';
import type { Metadata } from "next";
import {Inter} from 'next/font/google';
import { Providers } from "./providers";
import Navbar from "@/components/layout/Navbar";
import { ToastContainer} from 'react-toastify';
import Footer from '@/components/layout/Footer';
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
  title: {
    default: "Deepak Khira Enterprises",
    template: "%s | Deepak Khira Enterprises",
  },
  description:
    "Trusted Online Seller , Professional online business solutions — web development, mobile apps, UI/UX, and branding.",
  keywords: [
    "Deepak Khira",
    "Deepak Kushwah",
    "web development",
    "UI UX",
    "business solutions",
    "software development",
    "Deepak Khira Enterprises",
    "online seller",
    "business",
    "products",
    "video editing",
    "graphic design",
    "digital marketing",
    "freelancing",
    "professional services",
    "India",
    "Madhya Pradesh",
    "trusted seller",
    "reliable services",
    "custom software",
    "ecommerce solutions",
    "branding",
    "startup solutions",
    "technology services",
    "trader",
    "content creator",
    "resume builder",
    "portfolio website",
    "deepakkhiraenterprises",
    "full stack developer",
    "deepak khira web developer",
    "deepak khira",
    "deepak khira ui ux designer",
    "deepak khira software developer",
    "deepak khira freelancer",
    "deepak khira business solutions",
    "deepak khira digital marketing",
    "deepak khira graphic designer",
    "deepak khira video editor",
    "deepak khira entrepreneur",
    "deepak khira trader",
    "deepak khira content creator",
    "deepak khira resume builder",
    "deepak khira portfolio website",
    "deepak khira enterprises",
    "deepak khira m.p.",
    "deepak khira madhya pradesh",
    "deepak khira india",
    "deepak khira netlify",
    "deepak khira verified seller",
    "deepak khira trusted seller",
    "deepak khira reliable services",
    "deepak khira professional services",
    "deepak khira ecommerce solutions",
    "deepak kushwah",
    "deepak kushwah online seller",
    "deepak kushwah official",
    "deepak khera official",
  ],
  metadataBase: new URL("https://deepakkhiraenterprises.netlify.app/"),
  openGraph: {
    title: "Deepak Khira Enterprises",
    description:
      "Online Products • Trading • Digital Services • Content Creation. Trusted online seller from India.Professional web development, UI/UX, software solutions, and online services.",
    url: "https://deepakkhiraenterprises.netlify.app/",
    siteName: "Deepak Khira Enterprises",
    images: ["/og-image.jpg"],
    locale: "en_IN",
    type: "website",

    image: {
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "Deepak Khira Enterprises",
    },
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
  twitter: {
    card: "summary_large_image",
    title: "Deepak Khira Enterprises",
    description:
      "Professional online services for web development, design, and business solutions.",
    images: ["/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://facebook.com/deepakkhiraofficial",
  },
};


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 👇 IMPORTANT: ColorModeScript MUST BE IN HEAD */}
        <script id="chakra-script" dangerouslySetInnerHTML={{
          __html: `(function(){
            try {
              var theme = localStorage.getItem("chakra-ui-color-mode") || "light";
              document.documentElement.style.setProperty("color-scheme", theme);
              document.documentElement.setAttribute("data-theme", theme);
            } catch(e){}
          })();`
        }} />
      </head>

      <body suppressHydrationWarning>
      
        <Navbar />
        <Providers>{children}</Providers>
        <ToastContainer  />
        <Footer />
      </body>
    </html>
  );
}
