"use client";

import { useEffect, useState } from "react";
import { subscribeUser, unsubscribeUser } from "@/services/db/notification";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";

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

  if (!isSupported) {
    console.log("Push notifications aren't supported in this browser.");
    return null;
  }

  return (
    <div className="w-full max-w-sm">
      <Card>
        <CardContent>
          <Field className="max-w-sm">
            <FieldContent>
              <FieldLabel htmlFor="push-subscription">
                {subscription
                  ? "Unsubscribe from push notifications"
                  : "Subscribe to push notifications"}
              </FieldLabel>
            </FieldContent>
            <Button
              id="push-subscription"
              name="push-subscription"
              onClick={subscription ? unsubscribeFromPush : subscribeToPush}
            >
              {subscription ? "Unsubscribe" : "Subscribe "}
            </Button>
          </Field>
        </CardContent>
      </Card>
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
