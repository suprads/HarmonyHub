import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendFriendRequest } from "@/services/db/friend";
import { createNotification } from "@/services/db/notification";

const EXAMPLE_EMAIL = "email@example.com";
const SUN_LOVER_EMAIL = "sunlover63@example.com";

const users = [
  {
    name: "Name",
    email: EXAMPLE_EMAIL,
    password: "password",
    handle: "example",
  },
  {
    name: "Sun Lover",
    email: SUN_LOVER_EMAIL,
    password: "password123",
    handle: "sunlover63",
  },
  {
    name: "John Doe",
    email: "john345@example.com",
    password: "johnnyDoo4",
    handle: "john345",
  },
  {
    name: "Pixel Pioneer",
    email: "pixelpioneer@example.com",
    password: "pixelpassword",
    handle: "pixelpioneer",
  },
  {
    name: "Guitar Hero",
    email: "guitar_hero21@example.com",
    password: "heroboy2",
    handle: "guitar_hero21np",
  },
];

async function main() {
  for (const user of users) {
    const userExists = await prisma.user.findFirst({
      select: { id: true },
      where: { email: user.email },
    });

    if (!userExists) {
      await auth.api.signUpEmail({
        body: user,
      });
    } else {
      console.log(`User with email ${user.email} already exists.`);
    }
  }

  const exampleUser = await prisma.user.findUniqueOrThrow({
    select: { id: true },
    where: { email: EXAMPLE_EMAIL },
  });
  const sunLover = await prisma.user.findUniqueOrThrow({
    select: { id: true },
    where: { email: SUN_LOVER_EMAIL },
  });

  const friendReq = await sendFriendRequest(sunLover.id, exampleUser.id);
  if (friendReq) {
    await createNotification("FRIEND_REQUEST", [sunLover.id, exampleUser.id]);
  }
}

try {
  await main();
  await prisma.$disconnect();
} catch (error) {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
}
