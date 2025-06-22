// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@uploadthing/react/styles.css";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Inter, Poppins } from 'next/font/google';

// Fonts
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-poppins',
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShareNotes",
  description: "📚 Notes Sharing Platform – Simplify, Share, and Succeed",
  icons:{
    icon:"/favicon2.png", 
  },
  verification: {
    google: 'BcGehRZBgLX5V-kjB88HSz4AthSCJWnfZc159LAP1gc',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en"
      className={`${inter.variable} ${poppins.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <meta name="google-site-verification" content="BcGehRZBgLX5V-kjB88HSz4AthSCJWnfZc159LAP1gc" />
      </head>
      <body className="bg-[#f9fafb] font-poppins antialiased text-gray-900">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
