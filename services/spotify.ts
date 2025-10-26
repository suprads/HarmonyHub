import "server-only";
import { env } from "process";
import { redirect } from "next/navigation";

const REDIRECT_URI = "http://127.0.0.1:3000";

type AccessTokenResponse = {
  access_token: string;
  token_type: "Bearer";
  /** Time until token expires in seconds. */
  expires_in: number;
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

/**
 * Redirects the user to the Spotify authorization page to give our app access
 * to their account.
 */
export function authorizeUser() {
  const searchParams = new URLSearchParams({
    client_id: env.SPOTIFY_CLIENT_ID ?? "",
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    //state,
    scope: "user-top-read",
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
): Promise<AccessTokenResponse> {
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
) {
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
