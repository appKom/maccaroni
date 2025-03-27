"use client";
import { signOut, useSession } from "next-auth/react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, status } = useSession();
  const handleLogout = () => signOut({ callbackUrl: "/" });

  if (status === "loading") {
    return (
      <div className="min-h-screen text-white bg-inherit flex items-center justify-center">
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

  if (!session?.user.isAdmin) {
    return (
      <div className="flex flex-col bg-inherit items-center justify-center min-h-screen">
        <div className="flex flex-col items-center justify-center px-6 gap-5">
          <h1 className="text-3xl">Du har ikke tilgang til denne siden</h1>
          <h2 className="text-xl">{session?.user.name}</h2>
          <button
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            onClick={handleLogout}
          >
            Logg ut
          </button>
        </div>
      </div>
    );
  }

  return <div className="flex flex-col bg-inherit">{children}</div>;
}
