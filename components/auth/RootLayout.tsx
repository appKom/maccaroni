import { ReactNode } from "react";
import LoginScreen from "./LoginScreen";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = async ({ children }: RootLayoutProps) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <LoginScreen />;
  }

  return <>{children}</>;
};

export default RootLayout;
