import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Deepak Khira Enterprises",
    short_name: "Deepak Khira",
    description:
      "Deepak Khira Enterprises - Online Shopping",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4f46e5",
    orientation: "portrait",
    icons: [
      {
        src: "/business_logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/business_logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}