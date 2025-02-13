import { NextAuthOptions } from "next-auth";
import Auth0 from "next-auth/providers/auth0";

const production = process.env.NODE_ENV === "production";

export const authOptions: NextAuthOptions = {
  providers: [
    Auth0({
      clientId: process.env.AUTH0_CLIENT_ID as string,
      clientSecret: production
        ? (process.env.AUTH0_CLIENT_SECRET as string)
        : "",
      issuer: process.env.AUTH0_ISSUER_BASE_URL,
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
