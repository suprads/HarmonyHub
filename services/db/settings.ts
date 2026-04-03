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

  const settings = (
    await prisma.settings.findUniqueOrThrow({
      where: { userId },
      include: {
        notificationSettings: { omit: { id: true, settingsId: true } },
      },
      omit: { id: true, userId: true },
    })
  ).notificationSettings;

  if (settings && settingToCheck) {
    enabled = settings.enabled && settings[settingToCheck];
  } else if (settings) {
    enabled = settings.enabled;
  }

  return enabled;
}
