import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import styles from "../page.module.css";
import ProfileHeader from "./profile-header";
import { verifySession } from "@/services/auth/server";
import StatCard from "../stat-card";
import { getNumOfFriends } from "@/services/db/friend";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ handle?: string }>;
}) {
  const params = await searchParams;
  const { user } = await verifySession();

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

  const me = {
    name: "Nivi B",
    username: "@nivi.b",
    followers: 22,
    following: 318,
    // bio: "Hiii!!",
    playlists: 22,
    topArtists: [
      "Ariana Grande",
      "Mac Miller",
      "Harry Styles",
      "Olivia Rodrigo",
    ],
    topTracks: [
      { title: "The Less I Know The Better", artist: "Tame Impala" },
      { title: "Sweater Weather", artist: "The Neighbourhood" },
      { title: "505", artist: "Arctic Monkeys" },
      { title: "Electric Feel", artist: "MGMT" },
    ],
    activity: [],
  };

  return (
    <main className={styles.page}>
      <ProfileHeader profileView={profileView} />

      <Separator />

      <div className={styles.statsRow}>
        <StatCard
          label="Friends"
          displayValue={friendsNum?.toString() ?? "Error"}
        />
        <StatCard label="Playlists" displayValue={me.playlists.toString()} />
      </div>

      <Tabs defaultValue="overview" className={styles.tabs}>
        <TabsList className={styles.tabsList}>
          <TabsTrigger className={styles.tabTrigger} value="overview">
            Overview
          </TabsTrigger>
          {/* <TabsTrigger className={styles.tabTrigger} value="playlists">
            Playlists
          </TabsTrigger> */}
          <TabsTrigger className={styles.tabTrigger} value="ratings">
            Ratings
          </TabsTrigger>
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
                  {me.topTracks.map((t) => (
                    <div key={t.title} className={styles.trackRow}>
                      <div className={styles.trackText}>
                        <p className={styles.trackTitle}>{t.title}</p>
                        <p className={styles.trackMeta}>{t.artist}</p>
                      </div>

                      <Button
                        className={styles.viewButton}
                        variant="ghost"
                        size="sm"
                      >
                        View
                      </Button>
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
                  {me.topArtists.map((a) => (
                    <div key={a} className={styles.artistItem}>
                      <p className={styles.artistName}>{a}</p>
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

            <CardContent className={styles.cardBody}>
              <div className={styles.activityList}>
                {me.activity.map((x, i) => (
                  <div key={i} className={styles.activityRow}></div>
                ))}
              </div>
            </CardContent>
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
