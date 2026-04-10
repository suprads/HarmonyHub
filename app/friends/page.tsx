import { verifySession } from "@/services/auth/server";
import { getFriends } from "@/services/db/friend";
import FriendsItem from "@/app/friends/friends-item";

export default async function FriendsPage() {
  const session = await verifySession();
  const friends = await getFriends(session.user.id);

  return <FriendsItem initialFriends={friends} />;
}
