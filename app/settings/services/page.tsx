import Link from "next/link";

/**
 * Page where you can manage the services (e.g. Spotify) linked to your account.
 */
export default function ServicesPage() {
  return (
    <div>
      <h1>Services</h1>
      <main>
        <Link href="/settings/services/spotify">Spotify</Link>
      </main>
    </div>
  );
}
