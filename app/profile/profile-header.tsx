"use client";

import { Button } from "@/components/ui/button";
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
import styles from "./page.module.css";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@/components/ui/spinner";

export default function ProfileHeader() {
  const { data: session, isPending, isRefetching } = authClient.useSession();

  const user = {
    name: session?.user.name,
    handle: session?.user.handle,
    image: session?.user.image,
  };

  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState({ name: user.name, handle: user.handle });

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <Avatar className={styles.avatar}>
          <AvatarImage src={user.image ?? undefined} alt={user.name} />
          <AvatarFallback>
            {isPending || isRefetching ? <Spinner /> : user.name?.at(0)}
          </AvatarFallback>
        </Avatar>

        <div className={styles.info}>
          <h1 className={styles.name}>{user.name}</h1>
          <p className={styles.username}>{user.handle}</p>
          {/* <p className={styles.bio}>{profile.bio}</p> */}
        </div>
      </div>
      <div className={styles.headerActions}>
        <Button variant="secondary">Follow</Button>
        <Button variant="secondary">Message</Button>
        <Dialog
          open={editOpen}
          onOpenChange={(open) => {
            setEditOpen(open);
            if (open) setDraft(user);
          }}
        >
          <form>
            <DialogTrigger asChild>
              <Button>Edit Profile</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>

              <div className="grid gap-4">
                {/* <div className="grid gap-2">
                  <Label htmlFor="avatar">Avatar</Label>
                  <Input
                    id="avatar"
                    name="avatar"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const url = URL.createObjectURL(file);
                      setDraft((d) => ({ ...d, avatarUrl: url }));
                    }}
                  />
                </div> */}

                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
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
                    name="username"
                    value={draft.handle ?? undefined}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, handle: e.target.value }))
                    }
                  />
                </div>

                {/* <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    name="bio"
                    value={draft.bio}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, bio: e.target.value }))
                    }
                  />
                </div> */}
              </div>

              <DialogFooter>
                <Button variant="secondary" onClick={() => setEditOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={async () => {
                    const result = await authClient.updateUser(draft);
                    if (result.error) console.error(result.error.message);
                    setEditOpen(false);
                  }}
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>
    </header>
  );
}
