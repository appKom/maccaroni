"use client";

import { ReactNode } from "react";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { Button } from "@/components/Button";
import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  const { data: session, status } = useSession();

  const handleLogin = () =>
    signIn("auth0", {
      callbackUrl: "/admin",
    });

  if (status === "loading") {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-y-2  mb-4"></div>
          <h2 className="text-2xl font-semibold">
            Laster inn administrasjonspanel...
          </h2>
          <p className="text-slate-400 mt-2">
            Vennligst vent mens vi henter informasjonen din
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex flex-col items-center justify-center px-6 gap-5">
          <h1 className="text-3xl">Vennligst logg inn</h1>
          <Button
            title="Logg inn med OW"
            color="onlineOrange"
            onClick={handleLogin}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      {children}
    </>
  );
};

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
        <SessionProvider>
          <RootLayout>
            <Navbar />
            <main className="flex-grow mt-28">{children}</main>
            <Footer />
          </RootLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
