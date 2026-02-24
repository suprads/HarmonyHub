import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Used just to redirect to Spotify for authorization.
 */
export default async function SpotifyPage() {
  const result = await auth.api.linkSocialAccount({
    body: {
      provider: "spotify",
      scopes: ["user-top-read"],
    },
    headers: await headers(),
  });

  if (result.redirect && result.url) {
    redirect(result.url);
  }
}
