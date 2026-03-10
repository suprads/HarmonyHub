import styles from "./chart.module.css";
import * as SpotifyAPI from "@/services/spotify";
import ChartItem from "./chart-item";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { verifySession } from "@/services/auth/server";

export default async function ChartPage() {
  const session = await verifySession();

  const spotifyAccount = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      providerId: "spotify",
    },
  });

  if (!spotifyAccount) {
    return (
      <div className="page">
        <main className="main">
          <p>
            No charts to display. Please connect to at least one streaming
            service <Link href="/settings/services">here</Link>.
          </p>
        </main>
      </div>
    );
  }

  const tokenResponse = await auth.api.getAccessToken({
    body: {
      providerId: "spotify",
      accountId: spotifyAccount.accountId,
      userId: session.user.id,
    },
    headers: await headers(),
  });

  const topTracks = await SpotifyAPI.getTopTracks(tokenResponse.accessToken, {
    timeRange: "long_term",
    limit: 5,
  });

  const topArtists = await SpotifyAPI.getTopArtists(tokenResponse.accessToken, {
    timeRange: "long_term",
    limit: 5,
  });

  return (
    <div className={styles.chartPage}>
      <h1 className="text-4xl font-bold m-0 p-[auto]">
        Your Personalized Charts
      </h1>
      <main className="main">
        <div className="flex flex-row gap-8 items-start w-full justify-center max-[800px]:flex-col max-[800px]:items-center">
          <div className={styles.listColumn}>
            <h3 className={styles.topTracks}>Your Top Tracks</h3>
            <ol style={{ paddingLeft: 0, listStyle: "none" }}>
              {topTracks.items.map((track, i) => (
                <ChartItem
                  key={track.id}
                  itemNumber={i + 1}
                  imgUrl={track.album.images[2]?.url}
                  name={track.name}
                  subtitle={track.artists.map((a) => a.name).join(", ")}
                />
              ))}
            </ol>
          </div>

          <div className={styles.listColumn} style={{ marginTop: 0 }}>
            <h3 className={styles.topArtists}>Your Top Artists</h3>
            <ol style={{ paddingLeft: 0, listStyle: "none" }}>
              {topArtists.items.map((artist, i) => (
                <ChartItem
                  key={artist.id}
                  itemNumber={i + 1}
                  imgUrl={artist.images[2]?.url}
                  name={artist.name}
                  subtitle={artist.genres.slice(0, 3).join(", ")}
                />
              ))}
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}
