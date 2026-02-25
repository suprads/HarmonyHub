import { BetterAuthClientOptions } from "better-auth";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";

const authClientOptions: BetterAuthClientOptions = {
  // The base URL of the server (optional if you're using the same domain)
  // baseURL: "http://127.0.0.1:3000",
  baseURL: process.env.BETTER_AUTH_URL,
  fetchOptions: {
    credentials: "include",
  },
  plugins: [inferAdditionalFields<typeof auth>()],
};

/**
 * A client instance of Better Auth used to interact with the auth server.
 * Functions included with this should only be invoked on the client side.
 */
export const authClient = createAuthClient(authClientOptions);
