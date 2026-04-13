"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { YouTubeLinkForm } from "../../../components/youtube-link-form";
import { unlinkYouTubeAccount } from "@/services/db/youtubedb";
import { useRouter } from "next/navigation";

type YouTubeServiceDisplayProps = {
  userId: string;
  isLinked: boolean;
};

export default function YouTubeServiceDisplay({
  userId,
  isLinked,
}: YouTubeServiceDisplayProps) {
  const router = useRouter();

  return isLinked ? (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
          <h2>YouTube Music</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          className="w-full"
          onClick={async () => {
            await unlinkYouTubeAccount(userId);

            router.refresh();
          }}
        >
          Unlink YouTube Account
        </Button>
      </CardContent>
    </Card>
  ) : (
    <YouTubeLinkForm userId={userId} />
  );
}
