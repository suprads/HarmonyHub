import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import styles from "./page.module.css";
import ProfileHeader from "./profile-header";
import { verifySession } from "@/services/auth/server";
import StatCard from "./stat-card";
import { getNumOfFriends } from "@/services/db/friend";

export default async function ProfilePage() {
  const { user } = await verifySession();
  const friendsNum = await getNumOfFriends(user.id);

  const me = {
    // bio: "Hiii!!",
    playlists: 22,
    topArtists: ["B", "A", "x", "y"],
    topTracks: [
      { title: "Track One", artist: "Artist A" },
      { title: "Track Two", artist: "Artist B" },
      { title: "Track Three", artist: "Artist C" },
      { title: "Track Four", artist: "Artist D" },
    ],
    activity: [],
  };

  return (
    <main className={styles.page}>
      <ProfileHeader />

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
          <TabsTrigger className={styles.tabTrigger} value="playlists">
            Playlists
          </TabsTrigger>
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

// BODY content is placeholder for now
// TO DO
// 1. edit/view follower - my profile, follow - others profile, message
// 2. following/followers list
// 3. avatar - file validation (type/size), upload to storage,save returned URL
// 4. nest profiles - /profile/:username
// 5. charts in profile page
// 6. Follow/Unfollow behavior -optional
// 7. Counters (Followers / Following / Playlists)
// 8. message - later
// 9. success toast after edit or follow
