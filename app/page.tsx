import * as SpotifyAPI from "@/services/spotify";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { verifySession } from "@/services/auth/server";
import { decrypt } from "@/lib/encryption";
import RecentTracksCarousel, {
  type RecentTrack,
} from "@/components/recent-tracks-carousel";
import FriendsRecentTracksCarousel from "@/components/friends-recent-tracks-carousel";
import {
  getBestYouTubeThumbnailUrl,
  getYouTubeRecentlyPlayedTracks,
  type YouTubeHistoryTrack,
} from "@/services/youtube";

type CombinedRecentTrack = RecentTrack & {
  sortEpochMs: number;
};

function getYouTubeTimestamp(track: YouTubeHistoryTrack): number {
  if (
    typeof track.playedAtEpochMs === "number" &&
    Number.isFinite(track.playedAtEpochMs)
  ) {
    return track.playedAtEpochMs;
  }

  return 0;
}

// Note: Need to build project for PageProps<"/"> to not show as error.
// See https://nextjs.org/docs/15/app/getting-started/layouts-and-pages#route-props-helpers
export default async function HomePage() {
  const session = await verifySession();
  const requestHeaders = await headers();

  const spotifyAccount = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      providerId: "spotify",
    },
  });

  const youtubeAccount = await prisma.youtubeMusicAccount.findUnique({
    where: {
      userId: session.user.id,
    },
  });
  // make changes here for card
  if (!spotifyAccount && !youtubeAccount) {
    return (
      <div className="home-page-shell">
        <main className="main">
          <p>
            No tracks to display. Please connect to Spotify or YouTube Music{" "}
            <Link className="underline" href="/settings/services">
              here
            </Link>
            .
          </p>
        </main>
      </div>
    );
  }

  const [spotifyResult, youtubeResult] = await Promise.allSettled([
    spotifyAccount
      ? (async () => {
          const tokenResponse = await auth.api.getAccessToken({
            body: {
              providerId: "spotify",
              accountId: spotifyAccount.accountId,
              userId: session.user.id,
            },
            headers: requestHeaders,
          });

          return SpotifyAPI.getRecentlyPlayedTracks(tokenResponse.accessToken, {
            limit: 12,
          });
        })()
      : Promise.resolve(null),
    youtubeAccount
      ? getYouTubeRecentlyPlayedTracks({
          headers: {
            cookie: decrypt(youtubeAccount.cookie),
            authorization: decrypt(youtubeAccount.authorization),
          },
          limit: 12,
        })
      : Promise.resolve(null),
  ]);

  const recentlyPlayed =
    spotifyResult.status === "fulfilled" ? spotifyResult.value : null;
  const youtubeRecentlyPlayed =
    youtubeResult.status === "fulfilled" ? youtubeResult.value : null;

  const spotifyTracks: CombinedRecentTrack[] = (
    recentlyPlayed?.items ?? []
  ).map(({ track, played_at }) => ({
    id: `spotify-${track.id}-${played_at}`,
    title: track.name,
    artists: track.artists.map((artist) => artist.name).join(", "),
    source: "spotify",
    sourceLabel: "Spotify",
    coverImage: track.album.images[0]?.url,
    href: track.external_urls.spotify,
    playedAt: played_at,
    playedAtDisplay: new Date(played_at).toLocaleString(),
    sortEpochMs: Number.isFinite(new Date(played_at).getTime())
      ? new Date(played_at).getTime()
      : 0,
  }));

  const youtubeTracks: CombinedRecentTrack[] = (
    youtubeRecentlyPlayed?.tracks ?? []
  ).map((track: YouTubeHistoryTrack, index: number) => ({
    id: `youtube-${track.videoId ?? track.title ?? "track"}-${index}`,
    title: track.title ?? "Untitled track",
    artists: track.artist ?? "Unknown artist",
    source: "youtube",
    sourceLabel: "YouTube Music",
    coverImage: getBestYouTubeThumbnailUrl(track.thumbnails, track.videoId),
    href: track.videoId
      ? `https://music.youtube.com/watch?v=${track.videoId}`
      : "https://music.youtube.com",
    playedAt: track.played ?? undefined,
    playedAtDisplay: track.played ?? "Recently played",
    sortEpochMs: getYouTubeTimestamp(track),
  }));

  const combinedTracks = [...spotifyTracks, ...youtubeTracks].sort(
    (a, b) => b.sortEpochMs - a.sortEpochMs,
  );

  return (
    <div className="home-page-shell">
      <main className="home-page-main">
        <header className="home-page-header">
          {/* <p className="home-page-kicker">Spotify Activity</p> */}
          <h1 className="home-page-title">Recently Listened Tracks</h1>
          <p className="home-page-subtitle">
            Swipe through your latest listening history across Spotify and
            YouTube Music.
          </p>
        </header>

        <RecentTracksCarousel
          ariaLabel="Recently listened tracks carousel"
          title="All Recent Plays"
          description="Combined recent plays from Spotify and YouTube Music."
          emptyMessage="No recent listens were returned. Play a few songs on Spotify or YouTube Music and refresh."
          tracks={combinedTracks}
        />

        <FriendsRecentTracksCarousel userId={session.user.id} />
      </main>
    </div>
  );
}
