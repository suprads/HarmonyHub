import "server-only";
import { env } from "process";
import { redirect } from "next/navigation";

/**
 * A valid redirect URI for the Spotify API. These should match the valid URIs
 * in our app information registered in Spotify.
 */
export type RedirectUri =
  | "http://127.0.0.1:3000"
  | "http://127.0.0.1:3000/chart"
  | "http://127.0.0.1:3000/settings/services"
  | "http://127.0.0.1:3000/api/spotify";

type AccessTokenResponse = {
  access_token: string;
  token_type: "Bearer";
  /** Time until token expires in seconds. */
  expires_in: number;
  scope?: string;
  refresh_token?: string;
};

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

export type TopTrackResponse = {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  /** A set of artists or tracks. */
  items: Track[] | Artist[];
};

type AuthenticationError = {
  error: string;
  error_description: string;
};

/** Returned by Spotify for errors relating to API calls */
type SpotifyError = {
  error: {
    status: number;
    message: string;
  };
};

/**
 * Redirects the user to the Spotify authorization page to give our app access
 * to their account. Should return to the redirect URI with a code search
 * parameter.
 * @param redirectURI The URI that should be returned to after authentication.
 */
export function authorizeUser(redirectURI: RedirectUri) {
  const searchParams = new URLSearchParams({
    client_id: env.SPOTIFY_CLIENT_ID ?? "",
    response_type: "code",
    redirect_uri: redirectURI,
    //state,
    scope: "user-top-read",
    //show_dialog
  });

  redirect(`https://accounts.spotify.com/authorize?${searchParams.toString()}`);
}

/**
 * Retrieves an access token from the Spotify API.
 * @param code The authorization code returned from the Spotify authorization
 * page.
 * @throws Error if something went wrong with the authentication request.
 */
export async function getAccessToken(
  code: string,
  redirectURI: RedirectUri,
): Promise<AccessTokenResponse> {
  const encodedKeys = Buffer.from(
    `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`,
  ).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirectURI}`,
    headers: {
      Authorization: `Basic ${encodedKeys}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const json = await response.json();

  if (json.error) {
    const authError: AuthenticationError = json;
    throw new Error(`${authError.error}: ${authError.error_description}}`);
  }

  return json;
}

/**
 * Used to refresh the access token when it expires.
 * @returns JSON response from requesting a refresh. If a new refresh_token
 * isn't included, keep using the existing token.
 * @throws Error if something went wrong with the authentication request.
 * @url https://developer.spotify.com/documentation/web-api/tutorials/refreshing-tokens
 */
export async function refreshAccessToken(
  refreshToken: string,
): Promise<AccessTokenResponse> {
  const encodedKeys = Buffer.from(
    `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`,
  ).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    headers: {
      Authorization: `Basic ${encodedKeys}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const json = await response.json();

  if (json.error) {
    const authError: AuthenticationError = json;
    throw new Error(`${authError.error}: ${authError.error_description}}`);
  }

  return json;
}

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
): Promise<TopTrackResponse> {
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

  return json;
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
  return topTracks as TopTrackResponse & { items: Track[] };
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
  return topArtists as TopTrackResponse & { items: Artist[] };
}
