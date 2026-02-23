import { BetterAuthClientOptions } from "better-auth";
import { createAuthClient } from "better-auth/react";

const authClientOptions: BetterAuthClientOptions = {
  // The base URL of the server (optional if you're using the same domain)
  // baseURL: "http://localhost:3000",
};

/**
 * A client instance of Better Auth used to interact with the auth server.
 * Functions included with this should only be invoked on the client side.
 */
export const authClient = createAuthClient(authClientOptions);
