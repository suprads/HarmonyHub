import { prisma } from "@/lib/prisma";
import { verifySession } from "@/services/auth/server";
import ServiceDisplay from "./service-display";
import * as SpotifyAPI from "@/services/spotify";

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
    <div className="font-sans flex flex-col items-center justify-items-center gap-6 sm:p-20">
      <header>
        <h1 className="text-4xl font-bold m-0 p-[auto]">Services</h1>
      </header>
      <main className="flex flex-col items-center w-full">
        <div className="flex flex-row gap-6">
          <ServiceDisplay
            title="Spotify"
            provider="spotify"
            scopes={[...SpotifyAPI.SCOPES]}
            action={spotifyAccount ? "unlink" : "link"}
          />
        </div>
      </main>
    </div>
  );
}
