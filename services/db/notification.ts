"use server";

import webpush from "web-push";
import { prisma } from "@/lib/prisma";
import type { NotificationType } from "@/generated/prisma/enums";
import { Notification } from "@/generated/prisma/client";

if (
  !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  !process.env.VAPID_PRIVATE_KEY
) {
  console.warn(
    "The vapid keys aren't set as environment variables. These are needed " +
      "for push notifications to work.",
  );
}

// TODO Figure out what email/url we're supposed to put here
webpush.setVapidDetails(
  "mailto:austinschnee@proton.me",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

export async function subscribeUser(
  subscription: webpush.PushSubscription,
  sessionId: string,
) {
  const { endpoint, expirationTime, keys } = subscription;

  try {
    await prisma.pushSubscription.create({
      data: {
        sessionId,
        endpoint,
        expirationTime: expirationTime ? new Date(expirationTime) : null,
        auth: keys.auth,
        p256dh: keys.p256dh,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error subscribing user:", error);
    return {
      success: false,
      error: "Failed to subscribe user to notifications.",
    };
  }
}

export async function unsubscribeUser(sessionId: string) {
  try {
    await prisma.pushSubscription.delete({ where: { sessionId } });
  } catch (error) {
    console.error("Error unsubscribing user:", error);
    return {
      success: false,
      error: "Failed to unsubscribe user from notifications.",
    };
  }
  return { success: true };
}

export async function sendPushNotification(
  title: string,
  message: string,
  sessionId: string,
) {
  const subscription = await prisma.pushSubscription.findUnique({
    where: { sessionId },
  });
  if (!subscription) {
    // throw new Error("No subscription available");
    console.error("Error sending push notification: No subscription available");
    return { success: false, error: "No push subscription found." };
  }

  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        expirationTime: subscription.expirationTime?.getTime(),
        keys: {
          auth: subscription.auth,
          p256dh: subscription.p256dh,
        },
      },
      JSON.stringify({
        title: title,
        body: message,
        icon: "/icon.png",
      }),
    );
    return { success: true };
  } catch (error) {
    if (error instanceof webpush.WebPushError) {
      console.error("Error sending push notification:", error.message);
    }
    return { success: false, error: "Failed to send notification" };
  }
}

/**
 * Used to generate a message included with a notification.
 */
export async function genNotificationMsg(
  type: NotificationType,
  infoId: string,
) {
  if (type === "FRIEND_REQUEST") {
    const [senderId, receiverId] = infoId.split("_");
    const friendRequest = await prisma.friendRequest.findUnique({
      where: { senderId_receiverId: { senderId, receiverId } },
    });
    if (friendRequest) {
      const sender = await prisma.user.findUnique({
        select: { handle: true },
        where: { id: senderId },
      });
      return `You received a friend request from ${sender?.handle}`;
    } else {
      console.error(
        `Error finding friend request: friend request with id ${infoId} doesn't exist.`,
      );
    }
  }
}

/**
 * Creates a notification in the database. Sends a push notification to the
 * related user if they are subscribed receive them.
 * @param id Id in database to reference to get the data from. Composite IDs
 * should be given as an array. Table referenced depends on type argument
 * given.
 * @returns The newly created notification, or undefined if creating it failed.
 */
export async function createNotification(
  type: NotificationType,
  id: string | [string, string],
) {
  let newNotification: Notification | undefined;
  let userToNotifyId = "";
  const infoId = typeof id !== "string" ? `${id[0]}_${id[1]}` : id;

  if (type === "FRIEND_REQUEST" && typeof id !== "string") {
    const receiverId = id[1];
    userToNotifyId = receiverId;

    const currentNotification = await prisma.notification.findUnique({
      where: {
        type_infoId: { type: "FRIEND_REQUEST", infoId },
        userId: receiverId,
      },
    });

    if (!currentNotification) {
      newNotification = await prisma.notification.create({
        data: {
          userId: receiverId,
          infoId: infoId,
          type: "FRIEND_REQUEST",
        },
      });
    }
  }

  if (userToNotifyId) {
    // Getting every session the user has
    const [{ sessions }] = await prisma.user.findMany({
      select: {
        sessions: {
          select: { id: true, pushSubscription: { select: { id: true } } },
        },
      },
      where: { id: userToNotifyId },
    });
    if (sessions.length > 0) {
      const notificationMsg = await genNotificationMsg(type, infoId);

      for (const session of sessions) {
        if (session.pushSubscription) {
          await sendPushNotification(
            "Friend Request",
            notificationMsg ?? "",
            session.id,
          );
        }
      }
    }
  }
  return newNotification;
}
