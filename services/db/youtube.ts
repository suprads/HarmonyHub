"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Represents an account linked to a user, such as a Spotify or YouTube Music account.
 * @param userId The ID of the user linking their account.
 * @param cookie The cookie header from a request to music.youtube.com, used to authenticate API requests.
 * @param authorization The SAPISIDHASH value from the Authorization header of a request to music.youtube.com, used to authenticate API requests.
 */

export async function linkYouTubeAccount(
  userId: string,
  cookie: string,
  authorization: string,
) {
  await prisma.youtubeMusicAccount.upsert({
    where: { userId },
    update: { cookie, authorization },
    create: {
      userId,
      cookie,
      authorization,
    },
  });

  await prisma.account.create({
    data: {
      id: `ytmusic-${userId}`,
      userId,
      providerId: "YTMUSIC",
      accountId: userId,
    },
  });

  revalidatePath("/settings/services");
}

export async function unlinkYouTubeAccount(userId: string) {
  await prisma.youtubeMusicAccount.delete({
    where: { userId },
  });

  await prisma.account.delete({
    where: { id: `ytmusic-${userId}` },
  });

  revalidatePath("/settings/services");
}
