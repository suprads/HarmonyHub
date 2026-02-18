"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import styles from "./page.module.css";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  const [profile, setProfile] = useState({
    name: me.name,
    username: me.username,
    bio: me.bio,
    avatarUrl: "",
  });

  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState(profile);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Avatar className={styles.avatar}>
            {profile.avatarUrl ? (
              <AvatarImage src={profile.avatarUrl} alt={profile.name} />
            ) : null}
            <AvatarFallback>NB</AvatarFallback>
          </Avatar>

          <div className={styles.info}>
            <h1 className={styles.name}>{profile.name}</h1>
            <p className={styles.username}>{profile.username}</p>
            <p className={styles.bio}>{profile.bio}</p>
          </div>
        </div>

        <div className={styles.headerActions}>
          <Button variant="secondary">Follow</Button>
          <Button variant="secondary">Message</Button>
          {/* <Button>Edit Profile</Button> */}
          <Dialog
            open={editOpen}
            onOpenChange={(open) => {
              setEditOpen(open);
              if (open) setDraft(profile);
            }}
          >
            <DialogTrigger asChild>
              <Button>Edit Profile</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="avatar">Avatar</Label>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const url = URL.createObjectURL(file);
                      setDraft((d) => ({ ...d, avatarUrl: url }));
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={draft.name}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, name: e.target.value }))
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={draft.username}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, username: e.target.value }))
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    value={draft.bio}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, bio: e.target.value }))
                    }
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="secondary" onClick={() => setEditOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setProfile(draft);
                    setEditOpen(false);
                  }}
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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

// TO DO
// 1. edit/view follower - my profile, follow - others profile, message
// <div className={styles.headerActions}>
//   {isMe ? (
//     <Button onClick={() => setEditOpen(true)}>Edit Profile</Button>
//   ) : (
//     <>
//       <Button variant="secondary" onClick={onFollowToggle}>
//         {isFollowing ? "Following" : "Follow"}
//       </Button>
//       <Button variant="secondary" onClick={onMessage}>Message</Button>
//     </>
//   )}
// </div>
// 2. following/followers list
// 3. avatar - file validation (type/size), upload to storage,save returned URL
// 4. nest profiles - /profile/:username
// 5. charts in profile page
// 6. Follow/Unfollow behavior
// 7. Counters (Followers / Following / Playlists)
// 8. message - later
// 9. success toast after edit or follow
