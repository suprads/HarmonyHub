import { unstable_noStore as noStore } from "next/cache";
import { decrypt } from "@/lib/encryption";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/services/auth/server";
import { getFriends } from "@/services/db/friend";
import * as SpotifyAPI from "@/services/spotify";
import {
  getYouTubeRecentlyPlayedTracks,
  type YouTubeHistoryTrack,
} from "@/services/youtube";
import LeaderboardTable, { type LeaderboardRow } from "./leaderboard-table";

const RECENT_LIMIT = 50;

type LeaderboardUser = Pick<LeaderboardRow, "id" | "name" | "handle" | "image">;

type SpotifyAccountTokenSnapshot = {
  id: string;
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresAt: Date | null;
};

type YouTubeAccountSnapshot = {
  cookie: string;
  authorization: string;
};

type UserListeningProfile = LeaderboardUser & {
  spotifyAccount: SpotifyAccountTokenSnapshot | null;
  youtubeMusicAccount: YouTubeAccountSnapshot | null;
};

function getDayStart(referenceDate = new Date()) {
  const dayStart = new Date(referenceDate);
  dayStart.setHours(0, 0, 0, 0);
  return dayStart;
}

function getYouTubeTimestamp(track: YouTubeHistoryTrack): number {
  if (
    typeof track.playedAtEpochMs === "number" &&
    Number.isFinite(track.playedAtEpochMs)
  ) {
    return track.playedAtEpochMs;
  }

  return 0;
}

async function getUsableSpotifyAccessToken(
  account: SpotifyAccountTokenSnapshot,
): Promise<string | null> {
  const nowEpochMs = Date.now();
  const expiryEpochMs = account.accessTokenExpiresAt?.getTime() ?? null;

  if (
    account.accessToken &&
    (expiryEpochMs === null || expiryEpochMs > nowEpochMs + 30_000)
  ) {
    return account.accessToken;
  }

  if (!account.refreshToken) {
    return null;
  }

  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: account.refreshToken,
    }).toString(),
    cache: "no-store",
  });

  if (!tokenResponse.ok) {
    return null;
  }

  const refreshed = (await tokenResponse.json()) as {
    access_token?: string;
    expires_in?: number;
    refresh_token?: string;
  };

  if (!refreshed.access_token) {
    return null;
  }

  const refreshedExpiry =
    typeof refreshed.expires_in === "number"
      ? new Date(nowEpochMs + refreshed.expires_in * 1000)
      : null;

  await prisma.account.update({
    where: { id: account.id },
    data: {
      accessToken: refreshed.access_token,
      refreshToken: refreshed.refresh_token ?? account.refreshToken,
      accessTokenExpiresAt: refreshedExpiry,
    },
  });

  return refreshed.access_token;
}

async function countDailyLivePlays(user: UserListeningProfile, since: Date) {
  const [spotifyResult, youtubeResult] = await Promise.allSettled([
    (async () => {
      if (!user.spotifyAccount) {
        return 0;
      }

      const accessToken = await getUsableSpotifyAccessToken(
        user.spotifyAccount,
      );

      if (!accessToken) {
        return 0;
      }

      const recentlyPlayed = await SpotifyAPI.getRecentlyPlayedTracks(
        accessToken,
        {
          limit: RECENT_LIMIT,
        },
      );

      return recentlyPlayed.items.filter((item) => {
        const playedAt = new Date(item.played_at).getTime();
        return Number.isFinite(playedAt) && playedAt >= since.getTime();
      }).length;
    })(),
    (async () => {
      if (!user.youtubeMusicAccount) {
        return 0;
      }

      const youtubeRecentlyPlayed = await getYouTubeRecentlyPlayedTracks({
        headers: {
          cookie: decrypt(user.youtubeMusicAccount.cookie),
          authorization: decrypt(user.youtubeMusicAccount.authorization),
        },
        limit: RECENT_LIMIT,
      });

      return youtubeRecentlyPlayed.tracks.filter((track) => {
        const playedAtEpochMs = getYouTubeTimestamp(track);
        return playedAtEpochMs >= since.getTime();
      }).length;
    })(),
  ]);

  const spotifyPlays =
    spotifyResult.status === "fulfilled" ? spotifyResult.value : 0;
  const youtubePlays =
    youtubeResult.status === "fulfilled" ? youtubeResult.value : 0;

  return {
    spotifyPlays,
    youtubePlays,
    totalPlays: spotifyPlays + youtubePlays,
  };
}

export default async function LeaderboardsPage() {
  noStore();

  const session = await verifySession();

  const friends = await getFriends(session.user.id);

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: [session.user.id, ...friends.map((friend) => friend.id)],
      },
    },
    select: {
      id: true,
      name: true,
      handle: true,
      image: true,
      youtubeMusicAccount: {
        select: {
          cookie: true,
          authorization: true,
        },
      },
      accounts: {
        where: {
          providerId: "spotify",
        },
        select: {
          id: true,
          accessToken: true,
          refreshToken: true,
          accessTokenExpiresAt: true,
        },
        take: 1,
      },
    },
  });

  const currentUser = users.find((user) => user.id === session.user.id);

  if (!currentUser) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center justify-center px-4 py-10">
        <p>Unable to load your leaderboard right now.</p>
      </main>
    );
  }

  const since = getDayStart();

  const leaderboardUsers: UserListeningProfile[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    handle: user.handle,
    image: user.image,
    spotifyAccount: user.accounts[0] ?? null,
    youtubeMusicAccount: user.youtubeMusicAccount,
  }));

  const leaderboardRows = await Promise.all(
    leaderboardUsers.map(async (user) => {
      const counts = await countDailyLivePlays(user, since);

      return {
        ...user,
        ...counts,
        isCurrentUser: user.id === currentUser.id,
      } satisfies LeaderboardRow;
    }),
  );

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col gap-6 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold">Listening leaderboard</h1>
        <p className="max-w-2xl text-muted-foreground">
          A simple snapshot of how many tracks you and your direct friends have
          listened to today on Spotify and YouTube Music (live activity).
        </p>
      </header>
      <LeaderboardTable rows={leaderboardRows} />
    </main>
  );
}
