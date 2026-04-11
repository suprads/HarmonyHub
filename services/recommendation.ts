import {
  countArtistHistory,
  countGenreHistory,
  countHistory,
} from "@/services/db/history";
import { getFriends } from "@/services/db/friend";

export async function calcGenreScore(userId: string, genre: string) {
  let genreScore = 0;
  const tracksInHistory = await countHistory(userId);
  const genreCount = (await countGenreHistory(userId, genre)).at(0)?._count
    .tracks;

  if (tracksInHistory && genreCount) {
    genreScore = genreCount / tracksInHistory;
  }
  return genreScore;
}

export async function calcArtistScore(userId: string, artist: string) {
  let artistScore = 0;
  const tracksInHistory = await countHistory(userId);
  const artistCount = (await countArtistHistory(userId, artist)).at(0)?._count
    .tracks;

  if (tracksInHistory && artistCount) {
    artistScore = artistCount / tracksInHistory;
  }
  return artistScore;
}

export async function calcCompatScore(
  userId: string,
  genre: string,
  artist: string,
) {
  const userScore =
    (await calcGenreScore(userId, genre)) +
    (await calcArtistScore(userId, artist));

  const friends = await getFriends(userId);
  const friendCounts: number[] = [];

  for (const friend of friends) {
    const genreScore = await calcGenreScore(friend.id, genre);
    const artistScore = await calcArtistScore(friend.id, artist);

    friendCounts.push(genreScore + artistScore);
  }
  const friendAvg =
    friendCounts.reduce((a, b) => a + b, 0) / friendCounts.length;

  if (friendAvg) {
    return userScore / friendAvg;
  }
}
