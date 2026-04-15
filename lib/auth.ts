import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { createAuthMiddleware } from "better-auth/api";
import { createSettings } from "@/services/db/settings";
import * as SpotifyAPI from "@/services/spotify";

function normalizeOrigin(url: string): string {
  return url.replace(/\/$/, "");
}

const appUrl = normalizeOrigin(
  process.env.BETTER_AUTH_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_ENV === "production" &&
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://127.0.0.1:3000"),
);

const spotifyRedirectUri = normalizeOrigin(
  process.env.SPOTIFY_REDIRECT_URI ?? `${appUrl}/api/auth/callback/spotify`,
);

const trustedOrigins = Array.from(
  new Set([
    appUrl,
    ...(process.env.VERCEL_URL
      ? [normalizeOrigin(`https://${process.env.VERCEL_URL}`)]
      : []),
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? [
          normalizeOrigin(
            `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
          ),
        ]
      : []),
  ]),
);

/**
 * auth.api methods should be executed on the server.
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    spotify: {
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
      // Maps Spotify profile fields to the User model fields.
      mapProfileToUser: (profile) => {
        const base = profile.display_name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");
        const suffix = Math.random().toString(36).slice(2, 6);
        return {
          name: profile.display_name,
          image: profile.images.at(0)?.url,
          handle: `${base}_${suffix}`,
        };
      },
      redirectURI: spotifyRedirectUri,
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
