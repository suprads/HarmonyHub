/** The Spotify API scopes used by our app. */
export const SCOPES = Object.freeze([
  "user-top-read",
  "user-read-email",
  "user-read-recently-played",
]);

/** For queries that support paging of data. */
type Paging = {
  /** Number of items per page. */
  limit?: number;
  /** Page number. */
  offset?: number;
};

type TopTrackRequest = Paging & {
  type: "artists" | "tracks";
  timeRange?: "short_term" | "medium_term" | "long_term";
};

type RecentlyPlayedRequest = {
  /** Max number of items to return. */
  limit?: number;
  /** Unix timestamp in milliseconds. Return items before this time. */
  before?: number;
  /** Unix timestamp in milliseconds. Return items after this time. */
  after?: number;
};

type Image = {
  url: string;
  height: number | null;
  width: number | null;
};

export type Track = {
  album: {
    name: string;
    images: Image[];
    release_date: string;
  };
  artists: Pick<Artist, "external_urls" | "id" | "name">[];
  duration_ms: number;
  explicit: boolean;
  external_urls: { spotify: string };
  id: string;
  name: string;
};

export type Artist = {
  external_urls: { spotify: string };
  genres: string[];
  id: string;
  images: Image[];
  name: string;
  popularity: number;
};

export type TopItemsResponse = {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  /** A set of artists or tracks. */
  items: Track[] | Artist[];
};

type RecentlyPlayedItem = {
  track: Track;
  played_at: string;
};

export type RecentlyPlayedResponse = {
  href: string;
  limit: number;
  next: string | null;
  cursors: {
    after?: string;
    before?: string;
  };
  items: RecentlyPlayedItem[];
};

export type TopTracksResponse = Omit<TopItemsResponse, "items"> & {
  items: Track[];
};

export type TopArtistsResponse = Omit<TopItemsResponse, "items"> & {
  items: Artist[];
};

/** Returned by Spotify for errors relating to API calls */
type SpotifyError = {
  error: {
    status: number;
    message: string;
  };
};

/**
 * Gets the user's top tracks or artists from Spotify.
 * @throws Error if something went wrong when trying to access the API.
 * @url https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
 */
export async function getTopItems(
  accessToken: string,
  {
    type = "tracks",
    timeRange = "medium_term",
    limit = 20,
    offset = 0,
  }: TopTrackRequest,
) {
  const response = await fetch(
    `https://api.spotify.com/v1/me/top/${type}?time_range=${timeRange}&limit=${limit}&offset=${offset}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const json = await response.json();

  if (json.error) {
    const apiError: SpotifyError = json;
    throw new Error(apiError.error.message);
  }

  return json as TopItemsResponse;
}

/**
 * Shortcut for getting the top tracks with proper typing.
 * @see getTopItems
 */
export async function getTopTracks(
  accessToken: string,
  topTrackRequest: Omit<TopTrackRequest, "type">,
) {
  const topTracks = await getTopItems(accessToken, {
    ...topTrackRequest,
    type: "tracks",
  });
  return topTracks as TopTracksResponse;
}

/**
 * Shortcut for getting the top artists with proper typing.
 * @see getTopItems
 */
export async function getTopArtists(
  accessToken: string,
  topTrackRequest: Omit<TopTrackRequest, "type">,
) {
  const topArtists = await getTopItems(accessToken, {
    ...topTrackRequest,
    type: "artists",
  });
  return topArtists as TopArtistsResponse;
}

/**
 * Gets the user's recently played tracks from Spotify.
 * @throws Error if something went wrong when trying to access the API.
 * @url https://developer.spotify.com/documentation/web-api/reference/get-recently-played
 */
export async function getRecentlyPlayedTracks(
  accessToken: string,
  { limit = 20, before, after }: RecentlyPlayedRequest = {},
): Promise<RecentlyPlayedResponse> {
  const searchParams = new URLSearchParams({
    limit: limit.toString(),
  });

  if (before !== undefined) {
    searchParams.set("before", before.toString());
  }

  if (after !== undefined) {
    searchParams.set("after", after.toString());
  }

  const response = await fetch(
    `https://api.spotify.com/v1/me/player/recently-played?${searchParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    },
  );

  const json = await response.json();

  if (json.error) {
    const apiError: SpotifyError = json;
    throw new Error(apiError.error.message);
  }

  return json;
}
