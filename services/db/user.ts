"use server";

import { prisma } from "@/lib/prisma";

/**
 * Gets a list of usernames whose handles match the search term.
 * @param searchTerm The term to search for a user's handle by.
 * @param numOfResults The number of users to return. Defaults to all results.
 * @returns A list of the user's handles and IDs who match the search term.
 * List is ordered by relevance.
 */
export async function searchForUser(searchTerm: string, numOfResults?: number) {
  const userSearchResult = await prisma.user.findMany({
    select: {
      id: true,
      handle: true,
      image: true,
    },
    where: {
      handle: {
        contains: searchTerm,
        mode: "insensitive",
      },
    },
    orderBy: {
      _relevance: {
        fields: ["handle"],
        search: searchTerm,
        sort: "asc",
      },
    },
    take: numOfResults && numOfResults > -1 ? numOfResults : undefined,
  });
  return userSearchResult;
}

/**
 * Gets a user's handle and ID by their user ID.
 * @param userId The ID of the user to get the handle for.
 * @return The user's handle, or null if no user with the given ID exists.
 */
export async function getHandleByUserId(userId: string) {
  const user = await prisma.user.findUnique({
    select: {
      handle: true,
    },
    where: {
      id: userId,
    },
  });

  return user?.handle || null;
}
