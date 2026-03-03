import { prisma } from "@/lib/prisma";
import { LinkServiceButton, UnlinkServiceButton } from "./service-buttons";
import { verifySession } from "@/services/auth/server";

/**
 * Page where you can manage the services (e.g. Spotify) linked to your account.
 */
export default async function ServicesPage() {
  const session = await verifySession();

  const spotifyAccount = await prisma.account.findFirst({
    where: {
      providerId: "spotify",
      userId: session.user.id,
    },
  });

  return (
    <div>
      <header>
        <h1>Services</h1>
      </header>
      <main>
        <p>Spotify</p>
        {spotifyAccount ? (
          <UnlinkServiceButton provider="spotify" />
        ) : (
          <LinkServiceButton
            provider="spotify"
            scopes={["user-top-read", "user-read-email"]}
          />
        )}
      </main>
    </div>
  );
}
