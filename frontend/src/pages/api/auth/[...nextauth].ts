import jwt from "jsonwebtoken";
import NextAuth, { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface ExtendedUser extends NextAuthUser {
  id: string;
  username: string;
}

const TOKEN_EXPIRY =
  Number(process.env.ACCESS_TOKEN_EXPIRY_MINUTES) || 60 * 120;

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "",
  session: {
    strategy: "jwt",
    maxAge: TOKEN_EXPIRY,
  },
  pages: {
    signOut: "/auth/signout",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const response = await fetch(`${process.env.API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            username: credentials?.username || "",
            password: credentials?.password || "",
          }).toString(),
          credentials: "include",
        });

        if (response.status === 401) {
          throw new Error("Invalid credentials");
        }

        const access_token = response.headers
          .get("Set-Cookie")
          ?.split(";")[0]
          .split("=")[1];

        if (!process.env.JWT_SECRET) {
          throw new Error("JWT_SECRET is empty.");
        }

        try {
          const decoded = jwt.verify(
            access_token || "",
            process.env.JWT_SECRET || ""
          ) as unknown as ExtendedUser;

          if (response.ok && access_token) {
            return {
              access_token,
              id: decoded.id,
              username: decoded.username,
              startingCredits: decoded.credits,
              email: decoded.email,
              plan: decoded.plan,
            };
          }

          return null;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.access_token = user.access_token;
        token.id = user.id;
        token.username = user.username;
        token.startingCredits = user.startingCredits;
        token.email = user.email;
        token.plan = user.plan;
      }

      return token;
    },

    async session({ session, token }) {
      if (token.access_token) {
        session.user = {
          id: token.id as string,
          username: token.username as string,
          startingCredits: token.startingCredits as number,
          email: token.email,
          plan: token.plan,
        };
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
