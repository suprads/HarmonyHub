import { NextResponse } from "next/server";
import { sendFriendRequest } from "@/services/db/friend";
import { verifySession } from "@/services/auth/server";
import { createNotification } from "@/services/db/notification";
import { checkNotificationsEnabled } from "@/services/db/settings";

export async function POST(request: Request) {
  const { user } = await verifySession();
  try {
    const { receiverId } = await request.json();

    if (!receiverId) {
      return NextResponse.json(
        { error: "Receiver ID is required" },
        { status: 400 },
      );
    }

    const senderId = user.id;

    const result = await sendFriendRequest(senderId, receiverId);

    if (result) {
      const notificationsEnabled = await checkNotificationsEnabled(
        { userId: receiverId },
        "friendRequests",
      );
      if (notificationsEnabled) {
        await createNotification("FRIEND_REQUEST", [
          result.senderId,
          result.receiverId,
        ]);
      }
      return NextResponse.json({
        success: true,
        message: "Friend request sent successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Already friends or request already sent" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error sending friend request:", error);
    return NextResponse.json(
      { error: "Failed to send friend request" },
      { status: 500 },
    );
  }
}
