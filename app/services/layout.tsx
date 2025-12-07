export const metadata = {
  title:
    "Our Services – Deepak Khira Enterprises | Online Seller & Digital Solutions",
  description:
    "Deepak Khira Enterprises offers professional services including trading, online selling, content creation, video editing, resume building, and review services.",
  keywords: [
    "services",
    "online seller",
    "digital solutions",
    "content creation",
    "video editing",
    "resume building",
  ],
  openGraph: {
    title: "Professional Services – Deepak Khira Enterprises",
    description:
      "Trusted services for trading, online selling, content creation, video editing, resume building, and reviews.",
    url: "https://your-domain.com/services",
    images: [{ url: "/services-bg.png", width: 800, height: 600 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Deepak Khira Enterprises – Services",
    images: ["/services-bg.png"],
  },
  alternates: { canonical: "https://your-domain.com/services" },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
