import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { createAuthMiddleware } from "better-auth/api";
import { createSettings } from "@/services/db/settings";
import * as SpotifyAPI from "@/services/spotify";

/**
 * auth.api methods should be executed on the server.
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.VERCEL_URL!],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    spotify: {
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
      // Maps Spotify profile fields to the User model fields.
      mapProfileToUser: (profile) => {
        return {
          name: profile.display_name,
          image: profile.images.at(0)?.url,
        };
      },
      redirectURI: "http://127.0.0.1:3000/api/auth/callback/spotify",
      scope: [...SpotifyAPI.SCOPES],
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/sign-up")) {
        const user = ctx.context.newSession?.user;
        if (user) {
          await createSettings({ userId: user.id });
        }
      }
    }),
  },
  plugins: [nextCookies()], // make sure this is the last plugin in the array
  /* Per-table configs */
  user: {
    modelName: "User",
    additionalFields: {
      handle: {
        type: "string",
        required: false,
        input: true,
        unique: true,
      },
    },
  },
  session: { modelName: "Session" },
  account: {
    modelName: "Account",
    accountLinking: {
      enabled: true,
      // allowDifferentEmails: true,
      trustedProviders: ["spotify", "credential"],
    },
  },
  verification: { modelName: "Verification" },
});
