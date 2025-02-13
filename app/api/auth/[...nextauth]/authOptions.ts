import { NextAuthOptions } from "next-auth";
import Auth0 from "next-auth/providers/auth0";

const production = process.env.NODE_ENV === "production";

export const authOptions: NextAuthOptions = {
  providers: [
    Auth0({
      clientId: process.env.AUTH0_CLIENT_ID as string,
      clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
      issuer: process.env.AUTH0_ISSUER as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ account }): Promise<string | boolean> {
      try {
        if (!account?.access_token) {
          return false;
        }
        const isMember = true;
        return isMember;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      try {
        if (account && user) {
          if (production) {
            const apiUrl = "https://old.online.ntnu.no/api/v1/profile/";
            const headers = {
              Authorization: `Bearer ${account.access_token}`,
            };
            const response = await fetch(apiUrl, { headers });

            if (!response.ok) {
              throw new Error("Failed to fetch user profile");
            }

            const userInfo = await response.json();
            const commiteeUrl = `https://old.online.ntnu.no/api/v1/group/online-groups/?members__user=${userInfo.id}`;
            const committeeResponse = await fetch(commiteeUrl, { headers });

            if (!committeeResponse.ok) {
              throw new Error("Failed to fetch committees");
            }

            const committeeData = await committeeResponse.json();
            //eslint-disable-next-line
            const committees = committeeData.results.map((committee: any) =>
              committee.name_short.toLowerCase()
            );
            const adminCommittees = ["appkom", "arrkom"];
            token.isAdmin = adminCommittees.some((committee) =>
              committees.includes(committee)
            );
          } else {
            token.isAdmin = !!(
              user.email &&
              process.env.ADMIN_EMAILS?.split(",").includes(user.email)
            );
          }
        }
        return token;
      } catch (error) {
        console.error("Error in jwt callback:", error);
        token.isAdmin = false;
        return token;
      }
    },
    async session({ session, token }) {
      try {
        if (session.user) {
          (session.user as { isAdmin?: boolean }).isAdmin =
            token.isAdmin as boolean;
        }
        return session;
      } catch (error) {
        console.error("Error in session callback:", error);
        return session;
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
};
