import ErrorPage from "@/components/ErrorPage";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <body className="bg-gray-950 text-white  antialiased flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow mt-24 pb-24">
        <ErrorPage
          code={404}
          title="Siden ble ikke funnet"
          description="Oops! Siden du leter etter kan ha blitt fjernet eller er midlertidig utilgjengelig."
        />
      </main>
      <Footer />
    </body>
  );
}
