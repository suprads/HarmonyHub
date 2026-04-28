"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { encrypt } from "@/lib/encryption";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://127.0.0.1:3000";

/**
 * Represents an account linked to a user, such as a Spotify or YouTube Music
 * account.
 * @param userId The ID of the user linking their account.
 * @param cookie The cookie header from a request to music.youtube.com, used to
 * authenticate API requests.
 * @param authorization The SAPISIDHASH value from the Authorization header of a
 * request to music.youtube.com, used to authenticate API requests.
 */

async function validateYouTubeCredentials(
  cookie: string,
  authorization: string,
) {
  try {
    const res = await fetch(`${APP_URL}/api/ytmusic/health`, {
      method: "GET",
      headers: {
        "X-Cookie": cookie,
        "X-Authorization": authorization,
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.detail || `Status ${res.status}`);
    }
  } catch (err) {
    if (err && typeof err === "object" && "message" in err) {
      throw new Error(`Failed to validate YouTube credentials: ${err.message}`);
    }
  }
}

export async function linkYouTubeAccount(
  userId: string,
  cookie: string,
  authorization: string,
) {
  await validateYouTubeCredentials(cookie, authorization);

  await prisma.youtubeMusicAccount.upsert({
    where: { userId },
    update: { cookie, authorization },
    create: {
      userId,
      cookie: encrypt(cookie),
      authorization: encrypt(authorization),
    },
  });

  const existingAccountCredential = await prisma.account.findFirst({
    where: { userId: userId, providerId: "credential" },
  });

  const existingAccount = await prisma.account.findUnique({
    where: { id: `ytmusic-${userId}` },
  });

  if (existingAccountCredential && !existingAccount) {
    await prisma.account.create({
      data: {
        id: `ytmusic-${userId}`,
        userId,
        providerId: "YTMUSIC",
        accountId: userId,
        password: existingAccountCredential?.password,
      },
    });

    revalidatePath("/settings/services");
  }
}
export async function unlinkYouTubeAccount(userId: string) {
  await prisma.youtubeMusicAccount.delete({
    where: { userId },
  });

  revalidatePath("/settings/services");
}
