import { NextResponse } from "next/server";
import { searchForUser } from "@/services/db/user";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ users: [] });
    }

    const users = await searchForUser(query, 10);

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error searching for users:", error);
    return NextResponse.json(
      { error: "Failed to search for users" },
      { status: 500 },
    );
  }
}
