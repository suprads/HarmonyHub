"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  subscribeUser,
  unsubscribeUser,
  sendNotification,
} from "@/services/db/notification";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PushNotificationManager({
  sessionId,
}: {
  sessionId: string;
}) {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );

  useEffect(() => {
    async function getSubscription() {
      const registration = await navigator.serviceWorker.getRegistration();

      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        setSubscription(subscription);
      }
    }

    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      getSubscription();
    }
  }, []);

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready;
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        ),
      });
      setSubscription(subscription);
      const serializedSubscription = JSON.parse(JSON.stringify(subscription));
      await subscribeUser(serializedSubscription, sessionId);
    } catch (error) {
      if (error instanceof DOMException) {
        console.error("Failed to subscribe to notifications:", error.message);
      } else {
        console.error(error);
      }
    }
  }

  async function unsubscribeFromPush() {
    const unsubSuccess = await subscription?.unsubscribe();
    if (unsubSuccess) {
      setSubscription(null);
      await unsubscribeUser(sessionId);
    }
  }

  async function sendTestNotification(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const message = formData.get("message") as string | null;

    if (subscription && message) {
      const result = await sendNotification("Test Message", message, sessionId);
      console.log(result);
    }
  }

  if (!isSupported) {
    return (
      <div>
        <p>Push notifications are not supported in this browser.</p>
      </div>
    );
  }

  return (
    <div>
      {subscription ? (
        <>
          <p>You are subscribed to push notifications.</p>
          <Button onClick={unsubscribeFromPush}>Unsubscribe</Button>
          {process.env.NODE_ENV === "development" && (
            <form onSubmit={sendTestNotification}>
              <Input
                type="text"
                name="message"
                placeholder="Enter notification message"
              />
              <Button type="submit">Send Test</Button>
            </form>
          )}
        </>
      ) : (
        <>
          <p>You are not subscribed to push notifications in this browser.</p>
          <Button onClick={subscribeToPush}>Subscribe</Button>
        </>
      )}
    </div>
  );
}

function urlBase64ToUint8Array(base64String: string) {
  if (typeof window === "undefined") {
    throw new Error(
      `Function ${urlBase64ToUint8Array.name} can only be used client side.`,
    );
  }
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
