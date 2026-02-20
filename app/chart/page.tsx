import styles from "./chart.module.css";
import * as SpotifyAPI from "@/services/spotify";
import ChartItem from "./chart-item";

const REDIRECT_URI = "http://127.0.0.1:3000/chart";

// Note: Need to build project for PageProps<"/chart"> to not show as error.
// See https://nextjs.org/docs/15/app/getting-started/layouts-and-pages#route-props-helpers
export default async function ChartPage(props: PageProps<"/chart">) {
  const { code: spotifyCode }: { code?: string } = await props.searchParams;

  if (!spotifyCode) {
    console.log("Redirecting to Spotify to authorize user.");
    SpotifyAPI.authorizeUser(REDIRECT_URI);
  }

  const tokenResponse = await SpotifyAPI.getAccessToken(
    spotifyCode ?? "",
    REDIRECT_URI,
  );
  const topTracks = await SpotifyAPI.getTopItems(tokenResponse.access_token, {
    type: "tracks",
    timeRange: "long_term",
    limit: 5,
  });
  const topArtists = await SpotifyAPI.getTopItems(tokenResponse.access_token, {
    type: "artists",
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
                  subtitle={track.artists.map((a: any) => a.name).join(", ")}
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
