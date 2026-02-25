import styles from "./chart.module.css";
import * as SpotifyAPI from "@/services/spotify";
import { headers } from "next/headers";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ChartPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session) redirect("/login");

  const userId = session.user.id;
  const spotifyAccount = await prisma.account.findFirst({
    where: {
      userId: userId,
      providerId: "spotify",
    },
  });

  if (!spotifyAccount) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
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
      accountId: spotifyAccount.id,
      userId: userId,
    },
    headers: reqHeaders,
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
    <div className={styles.page}>
      <h1 className={styles.chartHeader}>Your Personalized Charts</h1>
      <main className={styles.main}>
        <div className={styles.logoContainer}>
          <div className={styles.listColumn}>
            <h3 className={styles.toptracks}>Your Top Tracks</h3>
            <ol style={{ paddingLeft: 0, listStyle: "none" }}>
              {topTracks.items.map((track, i) => (
                <li key={track.id} style={{ marginBottom: 12 }}>
                  <div
                    style={{ display: "flex", gap: 12, alignItems: "center" }}
                  >
                    <div
                      style={{
                        width: 28,
                        textAlign: "center",
                        fontWeight: 700,
                      }}
                    >
                      {i + 1}
                    </div>
                    {track.album.images[2]?.url && (
                      <Image
                        src={track.album.images[2].url}
                        alt={track.name}
                        width={64}
                        height={64}
                        style={{ borderRadius: 6 }}
                      />
                    )}
                    <div>
                      <div style={{ fontWeight: 600 }}>{track.name}</div>
                      <div style={{ fontSize: 12, color: "#666" }}>
                        {track.artists.map((a) => a.name).join(", ")}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className={styles.listColumn} style={{ marginTop: 0 }}>
            <h3 className={styles.topartists}>Your Top Artists</h3>
            <ol style={{ paddingLeft: 0, listStyle: "none" }}>
              {topArtists.items.map((artist, i) => (
                <li key={artist.id} style={{ marginBottom: 12 }}>
                  <div
                    style={{ display: "flex", gap: 12, alignItems: "center" }}
                  >
                    <div
                      style={{
                        width: 28,
                        textAlign: "center",
                        fontWeight: 700,
                      }}
                    >
                      {i + 1}
                    </div>
                    {artist.images[2]?.url && (
                      <Image
                        src={artist.images[2].url}
                        alt={artist.name}
                        width={64}
                        height={64}
                        style={{ borderRadius: 6 }}
                      />
                    )}
                    <div>
                      <div style={{ fontWeight: 600 }}>{artist.name}</div>
                      <div style={{ fontSize: 12, color: "#666" }}>
                        {artist.genres.slice(0, 3).join(", ")}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}
