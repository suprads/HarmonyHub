import prisma from "@/lib/prisma";

/**
 * @param userId The ID of the user who wants to follow another user.
 * @param userToFollowId The ID of the user you want to follow.
 */
export async function followUser(userId: string, userToFollowId: string) {
  const isFollowing = await prisma.follow.findFirst({
    where: {
      followedById: userId,
      followingId: userToFollowId,
    },
  });

  if (!isFollowing) {
    const followResult = await prisma.follow.create({
      data: {
        followedById: userId,
        followingId: userToFollowId,
      },
    });
  } else {
    console.warn(
      `User with ID ${userId} is already following user with ID ${userToFollowId}`,
    );
  }
}

/**
 * Checks if two users are friends.
 */
export async function isFriend(userId1: string, userId2: string) {
  const followsUser2 = await prisma.follow.findFirst({
    where: {
      followedById: userId1,
      followingId: userId2,
    },
  });
  const followsUser1 = await prisma.follow.findFirst({
    where: {
      followedById: userId2,
      followingId: userId1,
    },
  });

  return followsUser2 !== null && followsUser1 !== null;
}
