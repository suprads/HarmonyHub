import { betterAuth, BetterAuthOptions } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

const authOptions: BetterAuthOptions = {
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    spotify: {
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
      redirectURI: "http://127.0.0.1:3000/api/auth/callback/spotify",
    },
  },
  plugins: [nextCookies()], // make sure this is the last plugin in the array
  /* Per-table configs */
  user: {
    modelName: "User",
    additionalFields: {
      handle: {
        type: "string",
        required: true,
        input: true,
        unique: true,
      },
    },
  },
  session: { modelName: "Session" },
  account: {
    modelName: "Account",
    accountLinking: {
      allowDifferentEmails: true,
      trustedProviders: ["spotify"],
    },
    // TODO Should figure out how to make Spotify account linking work without this.
    skipStateCookieCheck: true,
  },
  verification: { modelName: "Verification" },
};

/**
 * auth.api methods should be executed on the server.
 */
export const auth = betterAuth(authOptions);
