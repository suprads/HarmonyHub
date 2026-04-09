"use client";

import { useState } from "react";
import { useEffect } from "react";
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
// import { prisma } from "@/lib/prisma";
// import { verifySession } from "@/services/auth/server";

export default function Profile() {
  const me = {
    name: "Nivi B",
    username: "@nivi.b",
    bio: "Hi there!",
    followers: 22,
    following: 318,
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

  const [profile, setProfile] = useState({
    name: me.name,
    username: me.username,
    bio: me.bio,
    avatarUrl: "",
  });

  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState(profile);

  // useEffect(() => {
  //   async function loadProfile() {
  //     try {
  //       const res = await fetch("/api/profile");
  //       const data = await res.json();

  //       setProfile((prev) => ({
  //         ...prev,
  //         ...data,
  //       }));
  //     } catch (err) {
  //       console.error("Failed to load profile", err);
  //     }
  //   }

  //   loadProfile();
  // }, []);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Avatar className={styles.avatar}>
            {profile.avatarUrl ? (
              <AvatarImage src={profile.avatarUrl} alt={profile.name} />
            ) : null}
            <AvatarFallback>DS</AvatarFallback>
          </Avatar>

          <div className={styles.info}>
            <h1 className={styles.name}>{profile.name}</h1>
            <p className={styles.username}>{profile.username}</p>
            <p className={styles.bio}>{profile.bio}</p>
          </div>
        </div>

        <div className={styles.headerActions}>
          <Button variant="secondary">Message</Button>
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
                {/* <Button
                  onClick={async () => {
                    try {
                      await fetch("/api/profile", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(draft),
                      });

                      setProfile(draft);
                      setEditOpen(false);
                    } catch (err) {
                      console.error("Failed to save profile", err);
                    }
                  }}
                >
                  Save
                </Button> */}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <Separator />

      <div className={styles.statsRow}>
        <Card className={styles.statCard}>
          <CardContent className={styles.statCardContent}>
            <p className={styles.statLabel}>Friends</p>
            <p className={styles.statValue}>{me.followers}</p>
          </CardContent>
        </Card>
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
