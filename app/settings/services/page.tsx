import { cookies } from "next/headers";
import Link from "next/link";

/**
 * Page where you can manage the services (e.g. Spotify) linked to your account.
 */
export default async function ServicesPage() {
  const cookieStore = await cookies();
  const spotifyCode = cookieStore.get("spotify_code")?.value;

  return (
    <div>
      <h1>Services</h1>
      <main>
        <p>
          {<Link href="/settings/services/spotify">Spotify</Link>} (
          {spotifyCode ? "Linked" : "Not linked"})
        </p>
      </main>
    </div>
  );
}
