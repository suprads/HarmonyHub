import { prisma } from "@/lib/prisma";
import { followUser } from "@/services/db/follow";
import { searchForUser } from "./services/db/user";

const result = await searchForUser("bo");
console.log(result);

const users = await prisma.user.findMany({
  where: {
    OR: [
      { handle: { equals: "alice_w" } },
      { handle: { equals: "ghost_hacker74" } },
    ],
  },
});

await followUser(users[0].id, users[1].id);
