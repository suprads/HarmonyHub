import * as SpotifyAPI from "@/services/spotify";

const REDIRECT_URI = "http://127.0.0.1:3000/api/spotify";

/**
 * Used just to redirect to Spotify for authorization.
 */
export default function SpotifyPage() {
  SpotifyAPI.authorizeUser(REDIRECT_URI);

  return null;
}
