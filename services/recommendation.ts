import { getUniqueArtists, getUniqueGenres } from "@/services/db/history";
import { decrypt } from "@/lib/encryption";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRecentlyPlayedTracks } from "@/services/spotify";
import { getYouTubeRecentlyPlayedTracks } from "@/services/youtube";

type YouTubeAccountSnapshot = {
  cookie: string;
  authorization: string;
};

type SpotifyAccountSnapshot = {
  id: string;
  accountId: string;
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresAt: Date | null;
};

type CompatibilityContext = {
  headers: Headers;
};

const RECENT_ARTIST_LIMIT = 50;

/**
 * Gets a compatibility score based on the two user IDs given.
 */
export async function getCompatScore(
  user1Id: string,
  user2Id: string,
  context?: CompatibilityContext,
) {
  const [user1Items, user2Items] = await Promise.all([
    getUserComparisonItems(user1Id, context),
    getUserComparisonItems(user2Id, context),
  ]);

  return Math.round(calcOverlap(user1Items, user2Items) * 100);
}

/**
 * Gets compatibility scores for a user against many friends with one shared
 * base profile fetch for better page performance.
 */
export async function getCompatScoresForFriends(
  userId: string,
  friendIds: string[],
  context?: CompatibilityContext,
) {
  const uniqueFriendIds = [...new Set(friendIds)].filter((id) => id !== userId);

  if (uniqueFriendIds.length === 0) {
    return new Map<string, number>();
  }

  const baseItems = await getUserComparisonItems(userId, context);

  const friendItems = await Promise.all(
    uniqueFriendIds.map(async (friendId) => {
      const items = await getUserComparisonItems(friendId, context);
      return [friendId, items] as const;
    }),
  );

  return new Map(
    friendItems.map(([friendId, items]) => [
      friendId,
      Math.round(calcOverlap(baseItems, items) * 100),
    ]),
  );
}

async function getUserComparisonItems(
  userId: string,
  context?: CompatibilityContext,
) {
  const [userGenres, userArtists, userLiveArtists] = await Promise.all([
    getUniqueGenres(userId),
    getUniqueArtists(userId),
    getLiveRecentArtists(userId, context),
  ]);

  return [
    ...userGenres.map((g) => normalizeText(g.name)),
    ...userArtists.map((a) => normalizeText(a.name)),
    ...Array.from(userLiveArtists),
  ].filter(Boolean);
}

function normalizeText(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

async function getSpotifyAccount(
  userId: string,
): Promise<SpotifyAccountSnapshot | null> {
  const spotifyAccount = await prisma.account.findFirst({
    where: {
      userId,
      providerId: "spotify",
    },
    select: {
      id: true,
      accountId: true,
      accessToken: true,
      refreshToken: true,
      accessTokenExpiresAt: true,
    },
  });

  return spotifyAccount;
}

function getYouTubeAccount(
  userId: string,
): Promise<YouTubeAccountSnapshot | null> {
  return prisma.youtubeMusicAccount.findUnique({
    where: {
      userId,
    },
    select: {
      cookie: true,
      authorization: true,
    },
  });
}

async function getLiveRecentArtists(
  userId: string,
  context?: CompatibilityContext,
): Promise<Set<string>> {
  const [spotifyAccount, youtubeMusicAccount] = await Promise.all([
    getSpotifyAccount(userId),
    getYouTubeAccount(userId),
  ]);

  const liveArtists = new Set<string>();

  const [spotifyResult, youtubeResult] = await Promise.allSettled([
    (async () => {
      if (!spotifyAccount) {
        return [] as string[];
      }

      const accessToken = await getSpotifyAccessTokenForUser({
        userId,
        spotifyAccount,
        context,
      });

      if (!accessToken) {
        return [] as string[];
      }

      const recentlyPlayed = await getRecentlyPlayedTracks(accessToken, {
        limit: RECENT_ARTIST_LIMIT,
      });

      return recentlyPlayed.items
        .flatMap((item) => item.track.artists.map((artist) => artist.name))
        .map((name) => normalizeText(name))
        .filter(Boolean);
    })(),
    (async () => {
      if (!youtubeMusicAccount) {
        return [] as string[];
      }

      const decryptedHeaders = {
        cookie: decrypt(youtubeMusicAccount.cookie),
        authorization: decrypt(youtubeMusicAccount.authorization),
      };

      const recentlyPlayed = await getYouTubeRecentlyPlayedTracks({
        headers: decryptedHeaders,
        limit: RECENT_ARTIST_LIMIT,
      });

      return recentlyPlayed.tracks
        .map((track) => normalizeText(track.artist))
        .filter(Boolean);
    })(),
  ]);

  if (spotifyResult.status === "fulfilled") {
    spotifyResult.value.forEach((artist) => {
      liveArtists.add(artist);
    });
  }

  if (youtubeResult.status === "fulfilled") {
    youtubeResult.value.forEach((artist) => {
      liveArtists.add(artist);
    });
  }

  return liveArtists;
}

async function getSpotifyAccessTokenForUser({
  userId,
  spotifyAccount,
  context,
}: {
  userId: string;
  spotifyAccount: SpotifyAccountSnapshot;
  context?: CompatibilityContext;
}): Promise<string | null> {
  if (context?.headers) {
    try {
      const tokenResponse = await auth.api.getAccessToken({
        body: {
          providerId: "spotify",
          accountId: spotifyAccount.accountId,
          userId,
        },
        headers: context.headers,
      });

      return tokenResponse.accessToken;
    } catch {
      // Fall through to the account token snapshot path.
    }
  }

  return getUsableSpotifyAccessToken(spotifyAccount);
}

async function getUsableSpotifyAccessToken(
  account: SpotifyAccountSnapshot,
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

function calcOverlap<T>(user1Items: T[], user2Items: T[]) {
  const user1Set = new Set(user1Items);
  const user2Set = new Set(user2Items);
  const commonItems = new Set<T>();

  for (const item of user2Set) {
    if (user1Set.has(item)) {
      commonItems.add(item);
    }
  }

  const uniqueItems = new Set([...user1Set, ...user2Set]);

  let overlapResult = 0;

  if (uniqueItems.size !== 0) {
    overlapResult = commonItems.size / uniqueItems.size;
  }

  return overlapResult;
}
