import PushNotificationManager from "@/app/settings/notifications/push-notification-manager";
import { verifySession } from "@/services/auth/server";

export default async function NotificationsPage() {
  const { session } = await verifySession();

  return (
    <div className="font-sans flex flex-col items-center justify-items-center gap-6 sm:p-20">
      <header>
        <h1 className="text-4xl font-bold m-0 p-[auto]">Notifications</h1>
      </header>
      <main className="flex flex-col items-center w-full">
        <PushNotificationManager sessionId={session.id} />
      </main>
    </div>
  );
}
