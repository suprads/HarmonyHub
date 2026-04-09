import * as SpotifyAPI from "@/services/spotify";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { verifySession } from "@/services/auth/server";

const REDIRECT_URI = "http://127.0.0.1:3000";

// Note: Need to build project for PageProps<"/"> to not show as error.
// See https://nextjs.org/docs/15/app/getting-started/layouts-and-pages#route-props-helpers
export default async function HomePage(props: PageProps<"/">) {
  const session = await verifySession();

  const spotifyAccount = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      providerId: "spotify",
    },
  });

  if (!spotifyAccount) {
    return (
      <div className="home-page-shell">
        <main className="main">
          <p>
            No tracks to display. Please connect to at least one streaming
            service{" "}
            <Link className="underline" href="/settings/services">
              here
            </Link>
            .
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

  const recentlyPlayed = await SpotifyAPI.getRecentlyPlayedTracks(
    tokenResponse.accessToken,
    {
      limit: 12,
    },
  );

  return (
    <div className="home-page-shell">
      <main className="home-page-main">
        <header className="home-page-header">
          {/* <p className="home-page-kicker">Spotify Activity</p> */}
          <h1 className="home-page-title">Recently Listened Tracks</h1>
          <p className="home-page-subtitle">
            Swipe through your latest listening history from Spotify.
          </p>
        </header>

        <section aria-label="Recently listened tracks carousel">
          <div className="recent-tracks-carousel">
            {recentlyPlayed.items.map(({ track, played_at }) => {
              const playedAt = new Date(played_at).toLocaleString();

              return (
                <article
                  key={`${track.id}-${played_at}`}
                  className="recent-track-card"
                >
                  <div className="recent-track-cover-wrapper">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={track.album.images[0]?.url}
                      alt={`${track.name} cover art`}
                      className="recent-track-cover-image"
                      loading="lazy"
                    />
                  </div>

                  <div className="recent-track-content">
                    <h2 className="recent-track-name">{track.name}</h2>
                    <p className="recent-track-artists">
                      {track.artists.map((artist) => artist.name).join(", ")}
                    </p>
                    <p className="recent-track-played-at">Played: {playedAt}</p>
                    <a
                      href={track.external_urls.spotify}
                      target="_blank"
                      rel="noreferrer"
                      className="recent-track-link"
                    >
                      Open in Spotify
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {recentlyPlayed.items.length === 0 && (
          <p className="recent-tracks-empty-state">
            No recently played tracks were returned. Play a few songs in Spotify
            and refresh.
          </p>
        )}
      </main>
    </div>
  );
}
