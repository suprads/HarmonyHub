import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Spotify redirect when authorizing account with API should be redirected
 * here to receive the code needed to access the Spotify API.
 */
export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const spotifyCode = searchParams.get("code");
  const cookieStore = await cookies();

  if (spotifyCode && typeof spotifyCode === "string") {
    cookieStore.set("spotify_code", spotifyCode);
  }

  redirect("/settings/services");
}
