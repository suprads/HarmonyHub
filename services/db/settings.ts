"use server";

import { prisma } from "@/lib/prisma";
import { NotificationSettings } from "@/generated/prisma/client";

export async function createSettings({ userId }: { userId: string }) {
  return await prisma.settings.create({
    data: {
      userId,
      notificationSettings: { create: {} },
    },
    include: { notificationSettings: true },
  });
}

/**
 * @param param0 The user to check the settings of.
 * @param settingToCheck Which specific setting to check. Only checks if
 * notifications are enabled if not specified.
 */
export async function checkNotificationsEnabled(
  { userId }: { userId: string },
  settingToCheck?: keyof Omit<
    NotificationSettings,
    "id" | "settingsId" | "enabled"
  >,
) {
  let enabled = false;
  let settings = await prisma.settings.findUnique({
    where: { userId },
    include: {
      notificationSettings: true,
    },
  });
  if (!settings) {
    settings = await createSettings({ userId });
  }
  const notificationSettings = settings?.notificationSettings;

  if (notificationSettings && settingToCheck) {
    enabled =
      notificationSettings.enabled && notificationSettings[settingToCheck];
  } else if (notificationSettings) {
    enabled = notificationSettings.enabled;
  }

  return enabled;
}
