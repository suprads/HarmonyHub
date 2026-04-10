"use server";

import { prisma } from "@/lib/prisma";
import { verifySession } from "@/services/auth/server";
import { acceptFriendRequest } from "@/services/db/friend";
import { rejectFriendRequest } from "@/services/db/friend";
import type { NotificationType } from "@/generated/prisma/enums";
import type { Notification } from "@/generated/prisma/client";

export async function changeToRead({
  id,
  read,
}: Pick<Notification, "id" | "read">) {
  if (!read) {
    await prisma.notification.update({
      data: { read: true },
      where: { id },
    });
  }
}

export async function notificationFriendRequestAction(
  {
    id,
    type,
    infoId,
  }: Pick<Notification, "id" | "infoId"> & {
    type: NotificationType;
  },
  action: "accept" | "reject",
) {
  if (type !== "FRIEND_REQUEST") {
    return { success: false, error: "Notification is not a friend request." };
  }

  const { user } = await verifySession();
  const notification = await prisma.notification.findUnique({
    where: { id },
    select: { id: true, userId: true, type: true, infoId: true },
  });

  if (!notification || notification.userId !== user.id) {
    return { success: false, error: "Notification not found." };
  }

  if (notification.type !== type || notification.infoId !== infoId) {
    return { success: false, error: "Notification data is invalid." };
  }

  const [senderId, receiverId] = notification.infoId.split("_");

  if (!senderId || !receiverId || receiverId !== user.id) {
    return { success: false, error: "Friend request data is invalid." };
  }

  if (action === "accept") {
    await acceptFriendRequest(senderId, receiverId);
  } else if (action === "reject") {
    await rejectFriendRequest(senderId, receiverId);
  }

  await prisma.notification.update({
    data: { read: true },
    where: { id: notification.id },
  });

  return { success: true };
}
