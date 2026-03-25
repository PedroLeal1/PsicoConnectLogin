import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { z } from "zod";
import bcrypt from "bcrypt";
import prisma from "./prisma";

export const authConfig: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(creds) {
        const schema = z.object({
          email: z.string().email(),
          password: z.string().min(6),
        });

        if (!creds) {
          throw new Error("Credenciais em falta.");
        }

        const parsed = schema.safeParse(creds);

        if (!parsed.success) {
          throw new Error("Email ou senha inválidos.");
        }

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          throw new Error("Nenhum utilizador encontrado com este email.");
        }

        const ok = await bcrypt.compare(password, user.passwordHash);

        if (!ok) {
          throw new Error("Email ou senha inválidos.");
        }

        if (!user.emailVerified) {
          throw new Error(
            "Por favor, verifique o seu email antes de fazer login.",
          );
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar.readonly",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }

      if (user && !token.id) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }

      if (account?.provider === "google") {
        token.googleAccessToken = account.access_token;
        token.googleRefreshToken =
          account.refresh_token ?? token.googleRefreshToken;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).googleAccessToken = token.googleAccessToken;
      }

      return session;
    },
  },
};
