// @ts-check
/// <reference lib="ES2017" />
/// <reference lib="webworker" />

// See https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
// for more info on service workers.

(() => {
  const self = /** @type {ServiceWorkerGlobalScope} */ (
    /** @type {unknown} */ (globalThis.self)
  );

  self.addEventListener("push", function (event) {
    if (event.data) {
      const data = event.data.json();
      const options = {
        body: data.body,
        icon: data.icon || "/icon.png",
        badge: data.badge || "/badge.png",
        vibrate: [100, 50, 100],
        // data: {
        //   dateOfArrival: Date.now(),
        //   primaryKey: "2",
        // },
      };
      event.waitUntil(self.registration.showNotification(data.title, options));
    }
  });

  self.addEventListener("notificationclick", function (event) {
    console.log("Notification click received.");
    event.notification.close();
    event.waitUntil(self.clients.openWindow("/notifications"));
  });
})();
