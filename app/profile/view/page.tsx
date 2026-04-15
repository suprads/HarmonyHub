import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import styles from "../page.module.css";
import ProfileHeader from "./profile-header";
import StatCard from "../stat-card";
import { getNumOfFriends } from "@/services/db/friend";
import { prisma } from "@/lib/prisma";
import * as SpotifyAPI from "@/services/spotify";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { decrypt } from "@/lib/encryption";
import RecentTracksCarousel, {
  type RecentTrack,
} from "@/components/recent-tracks-carousel";
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

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ handle?: string }>;
}) {
  const params = await searchParams;

  if (!params.handle) {
    return (
      <main className={styles.page}>
        <p>
          No user specified. Please provide a user handle in the query params.
        </p>
      </main>
    );
  }

  const profileView = await prisma.user.findUnique({
    where: {
      handle: params.handle,
    },
  });

  if (!profileView) {
    return (
      <main className={styles.page}>
        <p>User not found.</p>
      </main>
    );
  }

  const friendsNum = await getNumOfFriends(profileView.id);

  const spotifyAccount = await prisma.account.findFirst({
    where: {
      userId: profileView.id,
      providerId: "spotify",
    },
  });

  const youtubeAccount = await prisma.youtubeMusicAccount.findUnique({
    where: {
      userId: profileView.id,
    },
  });

  let tokenResponse:
    | Awaited<ReturnType<typeof auth.api.getAccessToken>>
    | undefined;
  let topTracks: SpotifyAPI.TopTracksResponse | undefined;
  let topArtists: SpotifyAPI.TopArtistsResponse | undefined;

  if (spotifyAccount) {
    tokenResponse = await auth.api.getAccessToken({
      body: {
        providerId: "spotify",
        accountId: spotifyAccount.accountId,
        userId: profileView.id,
      },
    });

    topTracks = await SpotifyAPI.getTopTracks(tokenResponse.accessToken, {
      timeRange: "long_term",
      limit: 5,
    });

    topArtists = await SpotifyAPI.getTopArtists(tokenResponse.accessToken, {
      timeRange: "long_term",
      limit: 5,
    });
  }

  const [spotifyResult, youtubeResult] = await Promise.allSettled([
    spotifyAccount
      ? (async () => {
          const tokenResponse = await auth.api.getAccessToken({
            body: {
              providerId: "spotify",
              accountId: spotifyAccount.accountId,
              userId: profileView.id,
            },
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

  const shortActivity = combinedTracks.slice(0, 5);

  return (
    <main className={styles.page}>
      <ProfileHeader profileView={profileView} />

      <Separator />

      <div className={styles.statsRow}>
        <StatCard
          label="Friends"
          displayValue={friendsNum?.toString() ?? "Error"}
        />
        {/* <StatCard label="Playlists" displayValue={me.playlists.toString()} /> */}
      </div>

      <Tabs defaultValue="overview" className={styles.tabs}>
        <TabsList className={styles.tabsList}>
          <TabsTrigger className={styles.tabTrigger} value="overview">
            Overview
          </TabsTrigger>
          {/* <TabsTrigger className={styles.tabTrigger} value="playlists">
            Playlists
          </TabsTrigger> */}
          {/* <TabsTrigger className={styles.tabTrigger} value="ratings">
            Ratings
          </TabsTrigger> */}
          <TabsTrigger className={styles.tabTrigger} value="activity">
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className={styles.tabContent}>
          <div className={styles.overviewGrid}>
            <Card className={styles.cardWide}>
              <CardHeader className={styles.cardHeader}>
                <CardTitle className={styles.cardTitle}>Top Tracks</CardTitle>
              </CardHeader>

              <CardContent className={styles.cardBody}>
                <div className={styles.trackList}>
                  {topTracks?.items.map((t) => (
                    <div key={t.id} className={styles.trackRow}>
                      <div className={styles.trackText}>
                        <p className={styles.trackTitle}>{t.name}</p>
                        <p className={styles.trackMeta}>
                          {t.artists.map((a) => a.name).join(", ")}
                        </p>
                      </div>
                      <Link href={t.external_urls.spotify}>
                        <Button
                          className={styles.viewButton}
                          variant="ghost"
                          size="sm"
                        >
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className={styles.cardNarrow}>
              <CardHeader className={styles.cardHeader}>
                <CardTitle className={styles.cardTitle}>Top Artists</CardTitle>
              </CardHeader>

              <CardContent className={styles.cardBody}>
                <div className={styles.artistList}>
                  {topArtists?.items.map((a) => (
                    <div key={a.id} className={styles.artistItem}>
                      <p className={styles.artistName}>{a.name}</p>
                      <p className={styles.artistMeta}>Artist</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className={styles.fullWidthCard}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>
                Recent Activity
              </CardTitle>
            </CardHeader>
            {shortActivity.length ? (
              <CardContent className={styles.cardBody}>
                <RecentTracksCarousel
                  ariaLabel="Recently listened tracks carousel"
                  title=""
                  description=""
                  emptyMessage="No recent listens were returned. Play a few songs on Spotify or YouTube Music and refresh."
                  tracks={shortActivity}
                />
              </CardContent>
            ) : (
              <CardContent className={styles.cardBody}>
                <p>No recent activity found.</p>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="playlists" className={styles.tabContent}>
          <Card className={styles.fullWidthCard}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>Playlists</CardTitle>
            </CardHeader>
            <CardContent className={styles.cardBody}>playlists</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ratings" className={styles.tabContent}>
          <Card className={styles.fullWidthCard}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>Ratings</CardTitle>
            </CardHeader>
            <CardContent className={styles.cardBody}>
              ratings + reviews
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className={styles.tabContent}>
          <Card className={styles.fullWidthCard}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>Activity</CardTitle>
            </CardHeader>
            <CardContent className={styles.cardBody}>
              <RecentTracksCarousel
                ariaLabel="Recently listened tracks carousel"
                title=""
                description=""
                emptyMessage="No recent listens were returned. Play a few songs on Spotify or YouTube Music and refresh."
                tracks={combinedTracks}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
