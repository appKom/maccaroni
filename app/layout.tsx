import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Onlove",
  description: "Veldedighetsauksjon for Online Linjeforening",
};

export default function WrappedRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <html lang="en">{children}</html>;
}
