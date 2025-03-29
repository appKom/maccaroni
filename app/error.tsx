"use client";

import ErrorPage from "@/components/ErrorPage";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Error() {
  return (
    <body className="bg-gray-950 text-white  antialiased flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow mt-24 pb-24">
        <ErrorPage
          code={500}
          title="Intern serverfeil"
          description="Vi beklager, men noe gikk galt på vår side. Vennligst prøv igjen senere."
        />
      </main>

      <Footer />
    </body>
  );
}
