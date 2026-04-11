"use server";

import { prisma } from "@/lib/prisma";

export async function countHistory(userId: string) {
  return await prisma.history.count({
    where: { userId },
  });
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
