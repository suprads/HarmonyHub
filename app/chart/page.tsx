import styles from "./chart.module.css";
import { getTopItems } from "@/services/spotify";

// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
const token =
  "BQCb5s9XZw10bc7PmyTDsJC5m-9aqnTG-wwhtugM_hy56GfTA-0W3rlseXQadKllYdwEQ-ARdkAXsUphanrWzC_2ZuvRCkWkeKN4Y4KZztfwYDUzZRDpJAUAJFTbrAQe0AZ4QLLIeciKjWDroKcQxyhIB8oG-NFF83bFszI56XdAXKwiS9TFPFXJ5TjZMjmzDxOxGgucXIaZc6tysTTqTQYa0FxTO1ZtyjBeRKJtFtYdNpcSR7ID-jY_MVWxzPTCGHp4gbGXVYe3nbvqjcPAl4C73B0ei-dR8lHIav12g8Qd73OAhrJo";
async function fetchWebApi(endpoint: string, method: string, body?: any) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body: body ? JSON.stringify(body) : undefined,
  });
  return await res.json();
}

async function getTopTracks() {
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  return (
    await fetchWebApi("v1/me/top/tracks?time_range=long_term&limit=5", "GET")
  ).items;
}

const topTracks = await getTopTracks();
console.log(
  topTracks?.map(
    ({ name, artists }) =>
      `${name} by ${artists.map((artist) => artist.name).join(", ")}`,
  ),
);

async function getTopArtists() {
  // Endpoint reference: https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  return (
    await fetchWebApi("v1/me/top/artists?time_range=long_term&limit=5", "GET")
  ).items;
}

const topArtists = await getTopArtists();
console.log(topArtists?.map(({ name }) => name));

export default function Page() {
  return (
    <div className={styles.page}>
      <h1 className={styles.chartHeader}>Your Personalized Charts</h1>
      <main className={styles.main}>
        <div className={styles.logoContainer}>
          <div className={styles.listColumn}>
            <h3 className={styles.toptracks}>Your Top Tracks</h3>
            <ol style={{ paddingLeft: 0, listStyle: "none" }}>
              {topTracks?.map((track: any, index: number) => (
                <li key={track?.id ?? index} style={{ marginBottom: 12 }}>
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
                      {index + 1}
                    </div>
                    {track?.album?.images?.[2]?.url && (
                      <img
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
                        {track.artists?.map((a: any) => a.name).join(", ")}
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
              {topArtists?.map((artist: any, index: number) => (
                <li key={artist?.id ?? index} style={{ marginBottom: 12 }}>
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
                      {index + 1}
                    </div>
                    {artist?.images?.[2]?.url && (
                      <img
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
                        {artist.genres?.slice(0, 3).join(", ")}
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
