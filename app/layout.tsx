import { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionWrapper from "@/components/auth/SessionWrapper";
import RootLayout from "@/components/auth/RootLayout";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Online Veldedighetsauksjon",
  description: "Veldedighetsauksjon for Online Linjeforening",
};

export default function WrappedRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <SessionWrapper>
          <Toaster />
          <Navbar />
          <RootLayout>
            <main className="flex-grow">{children}</main>
          </RootLayout>
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}
