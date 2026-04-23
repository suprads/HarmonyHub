"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  YouTubeLinkFormJson,
  YouTubeLinkFormCookieAuthorization,
} from "../../../components/youtube-link-form";
import { unlinkYouTubeAccount } from "@/services/db/youtubedb";
import { useRouter } from "next/navigation";
import { linkActionJson, linkActionCookieAuthorization } from "./actions";

type YouTubeServiceDisplayProps = {
  userId: string;
  isLinked: boolean;
};

export function YouTubeServiceDisplayJson({
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
    <YouTubeLinkFormJson linkAction={linkActionJson} />
  );
}

export function YouTubeServiceDisplayCookieAuthorization({
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
    <YouTubeLinkFormCookieAuthorization
      linkAction={linkActionCookieAuthorization}
    />
  );
}
