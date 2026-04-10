import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import styles from "./page.module.css";
import ProfileHeader from "./profile-header";
import { verifySession } from "@/services/auth/server";
import StatCard from "./stat-card";
import { getNumOfFriends } from "@/services/db/friend";
import { prisma } from "@/lib/prisma";
import * as SpotifyAPI from "@/services/spotify";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

export default async function ProfilePage() {
  const { user } = await verifySession();
  const friendsNum = await getNumOfFriends(user.id);

  const spotifyAccount = await prisma.account.findFirst({
    where: {
      userId: user.id,
      providerId: "spotify",
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
        userId: user.id,
      },
      headers: await headers(),
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

  return (
    <main className={styles.page}>
      <ProfileHeader />

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

            {/* <CardContent className={styles.cardBody}>
              <div className={styles.activityList}>
                {activity.map((x, i) => (
                  <div key={i} className={styles.activityRow}></div>
                ))}
              </div>
            </CardContent> */}
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
              Full activity feed.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
