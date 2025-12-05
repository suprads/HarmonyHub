import prisma from "@/lib/prisma";

/**
 * @param userId The ID of the user who wants to friend another user.
 * @param userToFriendId The ID of the user you want to friend.
 */
export async function friendUser(userId: string, userToFriendId: string) {
  const alreadyFriend = await isFriend(userId, userToFriendId);

  if (!alreadyFriend) {
    await prisma.friend.create({
      data: {
        friendedById: userId,
        friendId: userToFriendId,
      },
    });
  } else {
    console.warn(
      `User with ID ${userId} is already friends with user with ID ${userToFriendId}`,
    );
  }
}

/**
 * Checks if two users are friends.
 */
export async function isFriend(userId1: string, userId2: string) {
  const followsUser2 = await prisma.friend.findFirst({
    where: {
      friendedById: userId1,
      friendId: userId2,
    },
  });
  const followsUser1 = await prisma.friend.findFirst({
    where: {
      friendedById: userId2,
      friendId: userId1,
    },
  });

  return followsUser2 !== null && followsUser1 !== null;
}
