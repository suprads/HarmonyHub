"use server";

import { verifySession } from "@/services/auth/server";
import { linkYouTubeAccount } from "@/services/db/youtubedb";

export async function linkActionJson(
  prevState: { message?: string; success: boolean },
  formData: FormData,
) {
  const { user } = await verifySession();
  try {
    const headerRequest = formData.get("headerRequest") as string;
    const parsedHeaderRequest = JSON.parse(headerRequest);

    if (!parsedHeaderRequest?.requestHeaders?.headers) {
      throw new Error(
        "Invalid header request. Please enter a valid JSON string.",
      );
    }

    const headers: { name: string; value: string }[] =
      parsedHeaderRequest.requestHeaders.headers;

    const cookie = headers.find(
      (h) => h.name.toLowerCase() === "cookie",
    )?.value;
    const authorization = headers.find(
      (h) => h.name.toLowerCase() === "authorization",
    )?.value;

    if (!cookie || !authorization) {
      throw new Error(
        "Missing required headers. Please ensure both Cookie and Authorization headers are included.",
      );
    }

    await linkYouTubeAccount(user.id, cookie, authorization);
    return { message: "YouTube account linked successfully!", success: true };
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "Failed to link YouTube account. Please try again.",
      success: false,
    };
  }
}

export async function linkActionCookieAuthorization(
  prevState: { message?: string; success: boolean },
  formData: FormData,
) {
  const { user } = await verifySession();
  try {
    const cookie = formData.get("Cookie") as string;
    const authorization = formData.get("Authorization") as string;

    if (!cookie || !authorization) {
      throw new Error(
        "Missing required fields. Please ensure both Cookie and Authorization are included.",
      );
    }

    await linkYouTubeAccount(user.id, cookie, authorization);
    return { message: "YouTube account linked successfully!", success: true };
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "Failed to link YouTube account. Please try again.",
      success: false,
    };
  }
}
