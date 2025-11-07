import "server-only";
import { env } from "process";
import { redirect } from "next/navigation";

const REDIRECT_URI = "http://127.0.0.1:3000";

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

type TopTrackResponse = {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  /** A set of artists or tracks. */
  items: any[];
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
 */
export function authorizeUser() {
  const searchParams = new URLSearchParams({
    client_id: env.SPOTIFY_CLIENT_ID ?? "",
    response_type: "code",
    redirect_uri: REDIRECT_URI,
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
 */
export async function getAccessToken(
  code: string,
): Promise<AccessTokenResponse | AuthenticationError> {
  const encodedKeys = Buffer.from(
    `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`,
  ).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body: `grant_type=authorization_code&code=${code}&redirect_uri=${REDIRECT_URI}`,
    headers: {
      Authorization: `Basic ${encodedKeys}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.json();
}

/**
 * Used to refesh the access token when it expires.
 * @returns JSON response from requesting a refresh. If a new refresh_token
 * isn't included, keep using the existing token.
 * @url https://developer.spotify.com/documentation/web-api/tutorials/refreshing-tokens
 */
export async function refreshAccessToken(
  refreshToken: string,
): Promise<AccessTokenResponse | AuthenticationError> {
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

  return response.json();
}

/**
 * Gets the user's top tracks or artists from Spotify.
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
): Promise<TopTrackResponse | SpotifyError> {
  const response = await fetch(
    `https://api.spotify.com/v1/me/top/${type}?time_range=${timeRange}&limit=${limit}&offset=${offset}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return response.json();
}
