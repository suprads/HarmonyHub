"use server";

import { prisma } from "@/lib/prisma";

export async function createSettings({ userId }: { userId: string }) {
  return await prisma.settings.create({
    data: {
      userId,
      notificationSettings: { create: {} },
    },
    include: { notificationSettings: true },
  });
}
