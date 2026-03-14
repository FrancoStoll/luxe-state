import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
 variable: "--font-inter",
 subsets: ["latin"],
});

export const metadata: Metadata = {
 title: "Luxe Estate - Premium Real Estate",
 description: "Find your sanctuary with Luxe Estate. Premium real estate listings and luxury homes.",
};

import { LanguageProvider } from "@/lib/contexts/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased selection:bg-mosque selection:text-white`}
      >
        <LanguageProvider>
          <Navbar />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
