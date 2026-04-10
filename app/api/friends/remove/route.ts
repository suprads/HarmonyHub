import { NextResponse } from "next/server";
import { removeFriend } from "@/services/db/friend";
import { verifySession } from "@/services/auth/server";

export async function POST(request: Request) {
  const { user } = await verifySession();

  try {
    const { friendId } = await request.json();

    if (!friendId) {
      return NextResponse.json(
        { error: "Friend ID is required" },
        { status: 400 },
      );
    }

    const removed = await removeFriend(user.id, friendId);

    if (!removed) {
      return NextResponse.json(
        { error: "Friend relationship not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Friend removed successfully",
    });
  } catch (error) {
    console.error("Error removing friend:", error);
    return NextResponse.json(
      { error: "Failed to remove friend" },
      { status: 500 },
    );
  }
}
