import './globals.css';
import type { Metadata } from "next";
import {Inter} from 'next/font/google';
import { Providers } from "./providers";
import Navbar from "@/components/layout/Navbar";
import { ToastContainer} from 'react-toastify';
import Footer from '@/components/layout/Footer';


export const metadata: Metadata = {
  title: "Deepak Khira Enterprises",
  description: "Business Website",
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
