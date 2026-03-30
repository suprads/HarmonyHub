import "client-only";
import { authClient } from "@/lib/auth-client";

/**
 * Allows you to sign in or sign up with Spotify
 */
export async function spotifySignIn() {
  const result = await authClient.signIn.social({
    provider: "spotify",
  });

  if (result.error) {
    console.error("Spotify sign-in error:", result.error);
  }
}
