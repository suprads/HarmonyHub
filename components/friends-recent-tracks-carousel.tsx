import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";
import * as SpotifyAPI from "@/services/spotify";
import {
  getBestYouTubeThumbnailUrl,
  getYouTubeRecentlyPlayedTracks,
  type YouTubeHistoryTrack,
} from "@/services/youtube";
import RecentTracksCarousel, {
  type RecentTrack,
} from "@/components/recent-tracks-carousel";

type CombinedRecentTrack = RecentTrack & {
  sortEpochMs: number;
};

type SpotifyAccountTokenSnapshot = {
  id: string;
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresAt: Date | null;
};

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

type FriendsRecentTracksCarouselProps = {
  userId: string;
};

export default async function FriendsRecentTracksCarousel({
  userId,
}: FriendsRecentTracksCarouselProps) {
  const friendRecords = await prisma.friend.findMany({
    where: {
      friendedById: userId,
    },
    select: {
      friend: {
        select: {
          id: true,
          handle: true,
          name: true,
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
      },
    },
  });

  const friendRecentTrackResults = await Promise.allSettled(
    friendRecords.map(async ({ friend }) => {
      const spotifyFriendAccount = friend.accounts[0];
      const youtubeFriendAccount = friend.youtubeMusicAccount;
      const friendDisplayName = friend.handle
        ? `@${friend.handle}`
        : friend.name;

      const friendSpotifyTracks = async () => {
        if (!spotifyFriendAccount) {
          return [] as CombinedRecentTrack[];
        }

        const friendAccessToken =
          await getUsableSpotifyAccessToken(spotifyFriendAccount);

        if (!friendAccessToken) {
          return [] as CombinedRecentTrack[];
        }

        const friendRecentlyPlayed = await SpotifyAPI.getRecentlyPlayedTracks(
          friendAccessToken,
          {
            limit: 6,
          },
        );

        return friendRecentlyPlayed.items.map(({ track, played_at }) => ({
          id: `friend-${friend.id}-${track.id}-${played_at}`,
          title: track.name,
          artists: track.artists.map((artist) => artist.name).join(", "),
          source: "spotify" as const,
          sourceLabel: "Spotify",
          listenerName: friendDisplayName,
          listenerAvatar: friend.image ?? undefined,
          coverImage: track.album.images[0]?.url,
          href: track.external_urls.spotify,
          playedAtDisplay: new Date(played_at).toLocaleString(),
          sortEpochMs: Number.isFinite(new Date(played_at).getTime())
            ? new Date(played_at).getTime()
            : 0,
        }));
      };

      const friendYouTubeTracks = async () => {
        if (!youtubeFriendAccount) {
          return [] as CombinedRecentTrack[];
        }

        const friendYouTubeRecentlyPlayed =
          await getYouTubeRecentlyPlayedTracks({
            headers: {
              cookie: decrypt(youtubeFriendAccount.cookie),
              authorization: decrypt(youtubeFriendAccount.authorization),
            },
            limit: 6,
          });

        return (friendYouTubeRecentlyPlayed.tracks ?? []).map(
          (track: YouTubeHistoryTrack, index: number) => ({
            id: `friend-youtube-${friend.id}-${track.videoId ?? track.title ?? "track"}-${index}`,
            title: track.title ?? "Untitled track",
            artists: track.artist ?? "Unknown artist",
            source: "youtube" as const,
            sourceLabel: "YouTube Music",
            listenerName: friendDisplayName,
            listenerAvatar: friend.image ?? undefined,
            coverImage: getBestYouTubeThumbnailUrl(
              track.thumbnails,
              track.videoId,
            ),
            href: track.videoId
              ? `https://music.youtube.com/watch?v=${track.videoId}`
              : "https://music.youtube.com",
            playedAtDisplay: track.played ?? "Recently played",
            sortEpochMs: getYouTubeTimestamp(track),
          }),
        );
      };

      const [friendSpotifyResult, friendYouTubeResult] =
        await Promise.allSettled([
          friendSpotifyTracks(),
          friendYouTubeTracks(),
        ]);

      const spotifyTracks =
        friendSpotifyResult.status === "fulfilled"
          ? friendSpotifyResult.value
          : [];
      const youtubeTracks =
        friendYouTubeResult.status === "fulfilled"
          ? friendYouTubeResult.value
          : [];

      return [...spotifyTracks, ...youtubeTracks];
    }),
  );

  const friendRecentTracks = friendRecentTrackResults
    .flatMap((result) => (result.status === "fulfilled" ? result.value : []))
    .sort((a, b) => b.sortEpochMs - a.sortEpochMs)
    .slice(0, 24);

  return (
    <RecentTracksCarousel
      ariaLabel="Friends recently played tracks carousel"
      title="Friends Recently Played"
      description="What your friends have been listening to on Spotify and YouTube Music."
      emptyMessage="No friend listening activity yet. Add friends with connected Spotify or YouTube Music accounts and try again."
      tracks={friendRecentTracks}
    />
  );
}
