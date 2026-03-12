"use server";

import webpush from "web-push";
import { prisma } from "@/lib/prisma";

if (
  !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  !process.env.VAPID_PRIVATE_KEY
) {
  console.warn(
    "The vapid keys aren't set as environment variables. These are needed " +
      "for notifications to work.",
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

export async function sendNotification(
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
      console.error("Error sending push notification:", error);
    }
    return { success: false, error: "Failed to send notification" };
  }
}
