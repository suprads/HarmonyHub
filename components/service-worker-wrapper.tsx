"use client";

import { useEffect } from "react";

/**
 * Used to register a service worker for push notifications. Isn't meant to
 * display anything.
 */
export default function ServiceWorkerWrapper({
  children,
}: {
  children?: React.ReactNode;
}) {
  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.register("/service-worker.js", {
        scope: "/",
        updateViaCache: "none",
      });
    }
  }, []);

  return children;
}
