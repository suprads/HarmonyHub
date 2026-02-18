import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import styles from "./page.module.css";

// export default function Profile() {
//   const me = {
//     name: "Nivi B",
//     username: "@nivi",
//     bio: "Hiii!!",
//     followers: 1240,
//     following: 318,
//     playlists: 22,
//     topArtists: ["Ariana Grande", "Chase Atlantic", "x", "y"],
//     topTracks: [
//       { title: "Track One", artist: "Artist A" },
//       { title: "Track Two", artist: "Artist B" },
//       { title: "Track Three", artist: "Artist C" },
//       { title: "Track Four", artist: "Artist D" },
//     ],
//     activity: [],
//   };

//   return (
//     <main className="min-h-screen">
//       <div className="mx-auto max-w-6xl px-6">
//         {/* Profile header */}
//         <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:items-center">
//           <div className="flex items-end gap-4">
//             <Avatar className="h-24 w-24 ring-4 ring-background">
//               <AvatarImage src="" />
//               <AvatarFallback className="text-xl">NB</AvatarFallback>
//             </Avatar>

//             <div className="pb-1">
//               <h1 className="text-2xl font-semibold">{me.name}</h1>
//               <p className="text-sm text-muted-foreground">{me.username}</p>
//               <p className="mt-2 max-w-xl text-sm">{me.bio}</p>

//               <div className="mt-3 flex flex-wrap gap-2">
//                 <Badge variant="secondary">Verified Listener</Badge>
//               </div>
//             </div>
//           </div>

//           <div className="flex gap-2 sm:pb-2">
//             <Button variant="secondary">Follow</Button>
//             <Button variant="secondary">Message</Button>
//             <Button>Edit Profile</Button>
//           </div>
//         </div>
//         {/* header */}

//         <Separator className="my-6" />

//         <div className="grid grid-cols-3 gap-3 sm:max-w-md ">
//           <Card>
//             <CardContent className="p-4">
//               <p className="text-sm text-muted-foreground">Followers</p>
//               <p className="text-xl font-semibold">{me.followers}</p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4">
//               <p className="text-sm text-muted-foreground">Following</p>
//               <p className="text-xl font-semibold">{me.following}</p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4">
//               <p className="text-sm text-muted-foreground">Playlists</p>
//               <p className="text-xl font-semibold">{me.playlists}</p>
//             </CardContent>
//           </Card>
//         </div>

//         <Tabs defaultValue="overview" className="mt-8">
//           <TabsList>
//             <TabsTrigger value="overview">Overview</TabsTrigger>
//             <TabsTrigger value="playlists">Playlists</TabsTrigger>
//             <TabsTrigger value="ratings">Ratings</TabsTrigger>
//             <TabsTrigger value="activity">Activity</TabsTrigger>
//           </TabsList>

//           <TabsContent value="overview" className="mt-6 space-y-6">
//             <div className="grid gap-6 lg:grid-cols-3">
//               <Card className="lg:col-span-2">
//                 <CardHeader>
//                   <CardTitle>Top Tracks</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-3">
//                   {me.topTracks.map((t) => (
//                     <div
//                       key={t.title}
//                       className="flex items-center justify-between"
//                     >
//                       <div>
//                         <p className="font-medium">{t.title}</p>
//                         <p className="text-sm text-muted-foreground">
//                           {t.artist}
//                         </p>
//                       </div>
//                       <Button size="sm" variant="ghost">
//                         View
//                       </Button>
//                     </div>
//                   ))}
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle>Top Artists</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-2">
//                   {me.topArtists.map((a) => (
//                     <div key={a} className="rounded-md border px-3 py-2">
//                       <p className="font-medium">{a}</p>
//                       <p className="text-xs text-muted-foreground">Artist</p>
//                     </div>
//                   ))}
//                 </CardContent>
//               </Card>
//             </div>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Recent Activity</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 {me.activity.map((x, i) => (
//                   <div
//                     key={i}
//                     className="flex items-start justify-between gap-4"
//                   ></div>
//                 ))}
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="playlists" className="mt-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Playlists</CardTitle>
//               </CardHeader>
//               <CardContent className="text-sm text-muted-foreground">
//                 Add your playlist grid here (cover art cards).
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="ratings" className="mt-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Ratings</CardTitle>
//               </CardHeader>
//               <CardContent className="text-sm text-muted-foreground">
//                 Add album/song ratings + reviews here (list or cards).
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="activity" className="mt-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Activity</CardTitle>
//               </CardHeader>
//               <CardContent className="text-sm text-muted-foreground">
//                 Full activity feed (posts, follows, ratings, playlist edits).
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </main>
//   );
// }

export default function Profile() {
  const me = {
    name: "Nivi B",
    username: "@nivi",
    bio: "Hiii!!",
    followers: 1240,
    following: 318,
    playlists: 22,
    topArtists: ["Ariana Grande", "Chase Atlantic", "x", "y"],
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
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Avatar className={styles.avatar}>
            <AvatarFallback>NB</AvatarFallback>
          </Avatar>

          <div className={styles.info}>
            <h1 className={styles.name}>Nivi B</h1>
            <p className={styles.username}>@nivi</p>
            <p className={styles.bio}>Hiii!!</p>
          </div>
        </div>

        <div className={styles.headerActions}>
          <Button variant="secondary">Follow</Button>
          <Button variant="secondary">Message</Button>
          <Button>Edit Profile</Button>
        </div>
      </header>

      <Separator />

      {/* Stats */}
      {/* Stats */}
      <div className={styles.statsRow}>
        <Card className={styles.statCard}>
          <CardContent className={styles.statCardContent}>
            <p className={styles.statLabel}>Followers</p>
            <p className={styles.statValue}>{me.followers}</p>
          </CardContent>
        </Card>

        <Card className={styles.statCard}>
          <CardContent className={styles.statCardContent}>
            <p className={styles.statLabel}>Following</p>
            <p className={styles.statValue}>{me.following}</p>
          </CardContent>
        </Card>

        <Card className={styles.statCard}>
          <CardContent className={styles.statCardContent}>
            <p className={styles.statLabel}>Playlists</p>
            <p className={styles.statValue}>{me.playlists}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
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
            {/* Top Tracks (wide) */}
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

            {/* Top Artists (narrow) */}
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

          {/* Recent Activity (full width) */}
          <Card className={styles.fullWidthCard}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>
                Recent Activity
              </CardTitle>
            </CardHeader>

            <CardContent className={styles.cardBody}>
              <div className={styles.activityList}>
                {me.activity.map((x, i) => (
                  <div key={i} className={styles.activityRow}>
                    {/* build your activity row later */}
                  </div>
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
            <CardContent className={styles.cardBody}>
              Add your playlist grid here.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ratings" className={styles.tabContent}>
          <Card className={styles.fullWidthCard}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>Ratings</CardTitle>
            </CardHeader>
            <CardContent className={styles.cardBody}>
              Add ratings + reviews here.
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
