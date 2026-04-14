"use server";

import { prisma } from "@/lib/prisma";

type DailyListenCounts = {
  spotifyPlays: number;
  youtubePlays: number;
  totalPlays: number;
};

function getDayStart(referenceDate = new Date()) {
  const dayStart = new Date(referenceDate);
  dayStart.setHours(0, 0, 0, 0);
  return dayStart;
}

/**
 * @param genres If you only want the count for specific genres. Will return
 * count corresponding to every existing genre otherwise.
 * @returns An array of objects containing the genre name and the count of
 * tracks that have that genre in the user's history.
 */
export async function countGenreHistory(userId: string, ...genres: string[]) {
  const countResult = await prisma.genre.findMany({
    select: {
      name: true,
      _count: {
        select: {
          tracks: {
            where: {
              sources: {
                some: {
                  history: {
                    some: { userId },
                  },
                },
              },
            },
          },
        },
      },
    },
    where:
      genres.length > 0
        ? {
            OR: genres.map((g) => ({
              name: { equals: g.trim(), mode: "insensitive" },
            })),
          }
        : undefined,
  });
  return countResult;
}

export async function countArtistHistory(userId: string, ...artists: string[]) {
  const countResult = await prisma.artist.findMany({
    select: {
      name: true,
      _count: {
        select: {
          tracks: {
            where: {
              sources: {
                some: {
                  history: {
                    some: { userId },
                  },
                },
              },
            },
          },
        },
      },
    },
    where:
      artists.length > 0
        ? {
            OR: artists.map((a) => ({
              name: { equals: a.trim(), mode: "insensitive" },
            })),
          }
        : undefined,
  });
  return countResult;
}

/**
 * Gets each unique genre present in a user's track history.
 */
export async function getUniqueGenres(userId: string) {
  return prisma.genre.findMany({
    select: { name: true },
    distinct: ["name"],
    where: {
      tracks: {
        some: { sources: { some: { history: { some: { userId } } } } },
      },
    },
  });
}

/**
 * Gets each unique artist present in a user's track history.
 */
export async function getUniqueArtists(userId: string) {
  return prisma.artist.findMany({
    select: { name: true },
    distinct: ["name"],
    where: {
      tracks: {
        some: { sources: { some: { history: { some: { userId } } } } },
      },
    },
  });
}

/**
 * Counts a user's listens for the current day based on persisted history.
 */
export async function countDailyHistory(
  userId: string,
  since: Date = getDayStart(),
): Promise<DailyListenCounts> {
  const history = await prisma.history.findMany({
    select: {
      trackSource: {
        select: {
          provider: true,
        },
      },
    },
    where: {
      userId,
      OR: [
        {
          playedAt: {
            gte: since,
          },
        },
        {
          playedAt: null,
          createdAt: {
            gte: since,
          },
        },
      ],
    },
  });

  return history.reduce(
    (counts, play) => {
      if (play.trackSource.provider === "SPOTIFY") {
        counts.spotifyPlays += 1;
      }

      if (play.trackSource.provider === "YTMUSIC") {
        counts.youtubePlays += 1;
      }

      counts.totalPlays += 1;
      return counts;
    },
    {
      spotifyPlays: 0,
      youtubePlays: 0,
      totalPlays: 0,
    },
  );
}
