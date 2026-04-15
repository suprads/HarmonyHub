"use client";

import { Button } from "@/components/ui/button";
import styles from "../page.module.css";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfileHeader({
  profileView,
}: {
  profileView?: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image: string | null;
    handle: string | null;
  };
}) {
  if (!profileView) {
    return <header className={styles.header}></header>;
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <Avatar className={styles.avatar}>
          <AvatarImage
            src={profileView.image ?? undefined}
            alt={profileView.name}
          />
          <AvatarFallback>{profileView.name?.at(0)}</AvatarFallback>
        </Avatar>

        <div className={styles.info}>
          <h1 className={styles.name}>{profileView.name}</h1>
          <p className={styles.username}>@{profileView.handle}</p>
        </div>
        <div className={styles.headerActions}>
          <Button variant="secondary" className={styles.followButton}>
            Follow
          </Button>
          <Button variant="secondary" className={styles.messageButton}>
            Message
          </Button>
        </div>
      </div>
    </header>
  );
}
