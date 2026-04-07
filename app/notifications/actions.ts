"use server";

import { prisma } from "@/lib/prisma";
import type { Notification } from "@/generated/prisma/client";

export async function changeToRead({
  id,
  read,
}: Pick<Notification, "id" | "read">) {
  if (!read) {
    await prisma.notification.update({
      data: { read: true },
      where: { id },
    });
  }
}
