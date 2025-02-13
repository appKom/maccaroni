"use client";
import { ReactNode } from "react";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/Button";

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
      <div className="flex-grow text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-y-2  mb-4"></div>
          <h2 className="text-2xl font-semibold">
            Laster inn veldedighetsfesten...
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
      <div className="flex flex-col items-center justify-center flex-grow">
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

  return <>{children}</>;
};

export default RootLayout;
