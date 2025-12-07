import ProductList from "@/components/product/ProductList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Products | Deepak Khira Enterprises",
    template: "%s | Deepak Khira Enterprises",
  },
  description:
    "Explore top-quality products from Deepak Khira Enterprises. Trusted online seller offering business solutions, digital services, and more.",
  keywords: [
    "Deepak Khira",
    "Deepak Kushwah",
    "products",
    "online seller",
    "business solutions",
    "digital services",
    "trading",
    "ecommerce",
    "India",
    "Madhya Pradesh",
    "Deepak Khira Enterprises",
    "trusted seller",
  ],
  metadataBase: new URL("https://deepakkhiraenterprises.netlify.app/"),
  openGraph: {
    title: "Products | Deepak Khira Enterprises",
    description:
      "Discover premium products from Deepak Khira Enterprises. Trusted online seller with professional services and ecommerce solutions.",
    url: "https://deepakkhiraenterprises.netlify.app/products",
    siteName: "Deepak Khira Enterprises",
    images: [
      {
        url: "/og-products.jpg",
        width: 1200,
        height: 630,
        alt: "Deepak Khira Enterprises Products",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Products | Deepak Khira Enterprises",
    description:
      "Explore top-quality products from Deepak Khira Enterprises. Trusted online seller offering business solutions, digital services, and more.",
    images: ["/twitter-products.jpg"],
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
    canonical: "https://deepakkhiraenterprises.netlify.app/products",
  },
};

export default function Products() {
  return (
    <section className="py-20">
      <ProductList />
    </section>
  );
}
