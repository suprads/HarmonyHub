import { NextResponse } from "next/server";
import { sendFriendRequest } from "@/services/db/friend";

export async function POST(request: Request) {
  try {
    const { receiverId } = await request.json();

    if (!receiverId) {
      return NextResponse.json(
        { error: "Receiver ID is required" },
        { status: 400 },
      );
    }

    // TODO: Get the actual user ID from session/auth
    const senderId = "placeholder-user-id";

    const result = await sendFriendRequest(senderId, receiverId);

    if (result) {
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
