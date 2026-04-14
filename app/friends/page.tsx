import { unstable_noStore as noStore } from "next/cache";
import { headers } from "next/headers";
import { verifySession } from "@/services/auth/server";
import { getFriends } from "@/services/db/friend";
import { getCompatScoresForFriends } from "@/services/recommendation";
import FriendsItem from "@/app/friends/friends-item";

export default async function FriendsPage() {
  noStore();

  const session = await verifySession();
  const requestHeaders = await headers();
  const friends = await getFriends(session.user.id);

  const compatByFriendId = await getCompatScoresForFriends(
    session.user.id,
    friends.map((friend) => friend.id),
    { headers: requestHeaders },
  );

  const friendsWithCompatibility = friends.map((friend) => ({
    ...friend,
    compatibility: compatByFriendId.get(friend.id) ?? 0,
  }));

  return <FriendsItem initialFriends={friendsWithCompatibility} />;
}
