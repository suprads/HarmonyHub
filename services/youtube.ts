export type YouTubeThumbnail = {
  url?: string;
  width?: number;
  height?: number;
};

export type YouTubeHistoryTrack = {
  title: string | null;
  artist: string | null;
  album: string | null;
  duration: string | null;
  videoId: string | null;
  thumbnails: YouTubeThumbnail[];
  played?: string | null;
  playedAtEpochMs?: number | null;
  source: string;
};

type YouTubeAuthHeaders = {
  cookie: string;
  authorization?: string | null;
  x_goog_authuser?: string | null;
  origin?: string;
};

type YouTubeHistoryRequest = {
  headers: YouTubeAuthHeaders;
  limit?: number;
};

type YouTubeHistoryResponse = {
  tracks: YouTubeHistoryTrack[];
  count: number;
};

type YouTubeApiError = {
  detail?: string;
};

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://127.0.0.1:3000";

export function getBestYouTubeThumbnailUrl(
  thumbnails: YouTubeThumbnail[] | undefined,
  videoId?: string | null,
): string | undefined {
  if (videoId) {
    return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  }

  if (!thumbnails || thumbnails.length === 0) {
    return undefined;
  }

  const thumbnailsWithArea = thumbnails
    .filter((thumbnail) => Boolean(thumbnail.url))
    .map((thumbnail) => ({
      ...thumbnail,
      area:
        (thumbnail.width ?? 0) * (thumbnail.height ?? 0) ||
        (thumbnail.width ?? 0) ||
        (thumbnail.height ?? 0),
    }))
    .sort((left, right) => right.area - left.area);

  return thumbnailsWithArea[0]?.url ?? thumbnails.at(-1)?.url;
}

export async function getYouTubeRecentlyPlayedTracks(
  request: YouTubeHistoryRequest,
): Promise<YouTubeHistoryResponse> {
  const response = await fetch(`${APP_URL}/api/ytmusic/history`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      headers: {
        cookie: request.headers.cookie,
        authorization: request.headers.authorization ?? null,
        x_goog_authuser: request.headers.x_goog_authuser ?? "0",
        origin: request.headers.origin ?? "https://music.youtube.com",
      },
      limit: request.limit ?? 12,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const error = (await response
      .json()
      .catch(() => null)) as YouTubeApiError | null;
    throw new Error(
      error?.detail ?? `YouTube Music API error: ${response.status}`,
    );
  }

  return (await response.json()) as YouTubeHistoryResponse;
}
