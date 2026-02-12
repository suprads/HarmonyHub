import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const users = [
  {
    name: "Name",
    email: "email@example.com",
    password: "password",
    handle: "example",
  },
  {
    name: "Sun Lover",
    email: "sunlover63@example.com",
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
      where: {
        email: user.email,
      },
    });

    if (!userExists) {
      await auth.api.signUpEmail({
        body: user,
      });
    } else {
      console.log(`User with email ${user.email} already exists.`);
    }
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
