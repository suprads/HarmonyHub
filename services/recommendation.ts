import { getUniqueArtists, getUniqueGenres } from "@/services/db/history";

/**
 * Gets a compatibility score based on the two user IDs given.
 */
export async function getCompatScore(user1Id: string, user2Id: string) {
  const user1 = {
    genres: (await getUniqueGenres(user1Id)).map((g) => g.name),
    artists: (await getUniqueArtists(user1Id)).map((a) => a.name),
  };
  const user2 = {
    genres: (await getUniqueGenres(user2Id)).map((g) => g.name),
    artists: (await getUniqueArtists(user2Id)).map((a) => a.name),
  };
  return calcCompatScore(user1, user2);
}

/**
 * Used to calculate a user's compatibility score.
 * @returns The compatibility score as a percentage.
 */
function calcCompatScore(
  user1: {
    genres: string[];
    artists: string[];
  },
  user2: {
    genres: string[];
    artists: string[];
  },
) {
  const genreScore = calcOverlap(user1.genres, user2.genres);
  const artistScore = calcOverlap(user1.artists, user2.artists);

  return ((genreScore + artistScore) / 2) * 100;
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
