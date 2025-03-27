import { Metadata } from "next";
import "../globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionWrapper from "@/components/auth/SessionWrapper";
import RootLayout from "@/components/auth/RootLayout";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Onlove",
  description: "Veldedighetsauksjon for Online Linjeforening",
};

export default function WrappedRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body
    className={`${geistSans.variable} ${geistMono.variable} bg-gray-950 text-white  antialiased flex flex-col min-h-screen`}
    >
      <main className="flex-grow m-4">{children}</main>
    </body>
  );
}
