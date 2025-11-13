import styles from "./chart.module.css";
import * as SpotifyAPI from "@/services/spotify";
import Image from "next/image";

export default async function ChartPage() {
  const accessToken = await SpotifyAPI.getAccessToken("");

  const topTracks = await SpotifyAPI.getTopItems("", {
    type: "tracks",
    timeRange: "long_term",
    limit: 5,
  });
  const topArtists = await SpotifyAPI.getTopItems("", {
    type: "artists",
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
              {"items" in topTracks &&
                topTracks.items.map((track, i) => (
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
                          {track.artists.map((a: any) => a.name).join(", ")}
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
              {"items" in topArtists &&
                topArtists.items.map((artist, i) => (
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
