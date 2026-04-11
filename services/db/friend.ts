"use server";

import { prisma } from "@/lib/prisma";

/**
 * @param userId The ID of the user who wants to friend another user.
 * @param userToFriendId The ID of the user you want to friend.
 */
async function friendUser(userId: string, userToFriendId: string) {
  const alreadyFriend = await isFriend(userId, userToFriendId);

  if (!alreadyFriend) {
    await prisma.friend.createMany({
      data: [
        { friendedById: userId, friendId: userToFriendId },
        { friendedById: userToFriendId, friendId: userId },
      ],
    });
    return { success: true };
  } else {
    console.warn(
      `User with ID ${userId} is already friends with user with ID ${userToFriendId}`,
    );
    return { success: false };
  }
}

/**
 * Checks if two users are friends.
 */
export async function isFriend(userId1: string, userId2: string) {
  const followsUser2 = await prisma.friend.findUnique({
    where: {
      friendId_friendedById: { friendedById: userId1, friendId: userId2 },
    },
  });
  const followsUser1 = await prisma.friend.findUnique({
    where: {
      friendId_friendedById: { friendedById: userId2, friendId: userId1 },
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
 * @return The created friend request, or undefined if you're already a friend
 * or the friend request already exists.
 */
export async function sendFriendRequest(senderId: string, receiverId: string) {
  const alreadyFriend = await isFriend(senderId, receiverId);
  const currentFriendReq = await prisma.friendRequest.findUnique({
    omit: { createdAt: true },
    where: { senderId_receiverId: { senderId, receiverId } },
  });

  if (!alreadyFriend && !currentFriendReq) {
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
  const friendRequest = await prisma.friendRequest.findUnique({
    where: { senderId_receiverId: { senderId, receiverId } },
  });

  if (friendRequest) {
    const friendResult = await friendUser(senderId, receiverId);

    // Delete the friend request once the two users are friends
    if (friendResult.success) {
      await prisma.friendRequest.delete({
        where: {
          senderId_receiverId: { senderId, receiverId },
        },
      });
    }
  }
}

/**
 * Will remove an existing friend request without creating a friendship.
 */
export async function rejectFriendRequest(
  senderId: string,
  receiverId: string,
) {
  const friendRequest = await prisma.friendRequest.findUnique({
    where: { senderId_receiverId: { senderId, receiverId } },
  });

  if (friendRequest) {
    await prisma.friendRequest.delete({
      where: {
        senderId_receiverId: { senderId, receiverId },
      },
    });
  }
}

/**
 * Gets all friends for a given user.
 * @param userId The ID of the user whose friends to retrieve.
 * @returns A list of friends with their details.
 */
export async function getFriends(userId: string) {
  const friends = await prisma.friend.findMany({
    where: {
      friendedById: userId,
    },
    include: {
      friend: {
        select: {
          id: true,
          handle: true,
          email: true,
          image: true,
        },
      },
    },
    omit: { friendedById: true, friendId: true, createdAt: true },
  });

  return friends.map((f) => f.friend);
}

/**
 * Removes friendship in both directions for two users.
 * @returns true when a friendship existed and was removed.
 */
export async function removeFriend(userId: string, friendId: string) {
  const result = await prisma.friend.deleteMany({
    where: {
      OR: [
        { friendedById: userId, friendId },
        { friendedById: friendId, friendId: userId },
      ],
    },
  });

  return result.count > 0;
}

/**
 * Meant for getting the number of friends an individual user has.
 * @param userId The id of the user you want to get the amount of friends from.
 */
export async function getNumOfFriends(userId: string) {
  const user = await prisma.user.findUnique({
    include: {
      _count: {
        select: { friends: true },
      },
    },
    where: { id: userId },
  });

  return user?._count.friends;
}
