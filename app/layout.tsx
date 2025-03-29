import { Metadata } from "next";
import "./globals.css";
import SessionWrapper from "@/components/auth/SessionWrapper";

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
    <html lang="en">
      <SessionWrapper>{children}</SessionWrapper>
    </html>
  );
}
