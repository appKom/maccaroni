import { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ account }): Promise<string | boolean> {
      if (!account?.access_token) {
        return false;
      }

      try {
        const isMember = true;

        return isMember;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        try {
          token.isAdmin = !!(
            user.email &&
            process.env.ADMIN_EMAILS?.split(",").includes(user.email)
          );
        } catch (error) {
          console.error("Error fetching orgs in jwt callback:", error);
          token.isAdmin = false;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { isAdmin?: boolean }).isAdmin =
          token.isAdmin as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
};
