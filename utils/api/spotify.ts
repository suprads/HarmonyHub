import "server-only";
import { env } from "process";

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
 * Retrieves an access token from the Spotify API using the client credentials
 * flow.
 * @url https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow
 */
export async function getAccessToken(): Promise<AccessTokenResponse> {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body: `grant_type=client_credentials&client_id=${env.SPOTIFY_CLIENT_ID}&client_secret=${env.SPOTIFY_CLIENT_SECRET}`,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
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
        Authorization: `Bearer  ${accessToken}`,
      },
    },
  );

  return response.json();
}
