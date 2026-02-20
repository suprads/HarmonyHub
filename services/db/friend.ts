import { prisma } from "@/lib/prisma";

/**
 * @param userId The ID of the user who wants to friend another user.
 * @param userToFriendId The ID of the user you want to friend.
 */
async function friendUser(userId: string, userToFriendId: string) {
  const alreadyFriend = await isFriend(userId, userToFriendId);

  if (!alreadyFriend) {
    return await prisma.friend.create({
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

/**
 * Use to retrieve friend requests.
 */
export async function getPendingRequests({
  senderId,
  receiverId,
}: {
  senderId?: string;
  receiverId?: string;
}) {
  return await prisma.friendRequest.findMany({
    where: { senderId, receiverId },
  });
}

/**
 * Will create a friend request in the database if the two given users aren't
 * already friends.
 */
export async function sendFriendRequest(senderId: string, receiverId: string) {
  const alreadyFriend = await isFriend(senderId, receiverId);

  if (!alreadyFriend) {
    return await prisma.friendRequest.create({
      data: { senderId, receiverId },
    });
  }
}

/**
 * Will remove an existing friend request and make the two users in question
 * friends. Only works if there is an existing friend request.
 */
export async function acceptFriendRequest(
  senderId: string,
  receiverId: string,
) {
  const friendRequest = await prisma.friendRequest.findFirst({
    where: { senderId, receiverId },
  });

  if (friendRequest) {
    const friendResult = await friendUser(senderId, receiverId);

    // Delete the friend request once the two users are friends
    if (friendResult)
      prisma.friendRequest.delete({
        where: {
          senderId_receiverId: { senderId, receiverId },
        },
      });
  }
}
