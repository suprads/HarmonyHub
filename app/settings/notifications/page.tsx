import { prisma } from "@/lib/prisma";
import { verifySession } from "@/services/auth/server";
import SettingsForm from "./settings-form";

export default async function NotificationSettingsPage() {
  const { user } = await verifySession();

  const notificationSettings = (
    await prisma.settings.findUnique({
      include: { notificationSettings: true },
      where: { userId: user.id },
    })
  )?.notificationSettings;

  return (
    <div className="font-sans flex flex-col items-center justify-items-center gap-6 sm:p-20">
      <main className="flex flex-col items-center w-full">
        {notificationSettings ? (
          <SettingsForm settings={notificationSettings} saveAction={save} />
        ) : (
          <p>There was a problem retrieving your notification settings.</p>
        )}
      </main>
    </div>
  );
}

/**
 * @returns An error message if an error occurred.
 */
async function save(
  prevState: { message: string } | undefined,
  formData: FormData,
) {
  "use server";

  const { user } = await verifySession();

  const enabled = Boolean(formData.get("enabled"));
  const friendRequests = Boolean(formData.get("friend-requests"));

  try {
    const settings = await prisma.notification.findUniqueOrThrow({
      select: { id: true },
      where: { userId: user.id },
    });
    await prisma.notificationSettings.update({
      where: { settingsId: settings.id },
      data: { enabled, friendRequests },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    return { message: "Failed to save changes. Please try again later." };
  }
}
