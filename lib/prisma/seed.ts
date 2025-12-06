import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

//const prisma = new PrismaClient();

const userUpserts: Prisma.UserUpsertArgs[] = [
  {
    where: { handle: "johndoe99" },
    update: {},
    create: {
      handle: "johndoe99",
    },
  },
  {
    where: { handle: "bob_builder" },
    update: {},
    create: {
      handle: "bob_builder",
    },
  },
  {
    where: { handle: "alice_w" },
    update: {},
    create: {
      handle: "alice_w",
    },
  },
  {
    where: { handle: "sam_tones" },
    update: {},
    create: {
      handle: "sam_tones",
    },
  },
  {
    where: { handle: "mary_rose" },
    update: {},
    create: {
      handle: "mary_rose",
    },
  },
  {
    where: { handle: "ghost_hacker74" },
    update: {},
    create: {
      handle: "ghost_hacker74",
    },
  },
  {
    where: { handle: "emily_g" },
    update: {},
    create: {
      handle: "emily_g",
    },
  },
  {
    where: { handle: "michael89" },
    update: {},
    create: {
      handle: "michael89",
    },
  },
  {
    where: { handle: "sarah_88" },
    update: {},
    create: {
      handle: "sarah_88",
    },
  },
  {
    where: { handle: "chris_code" },
    update: {},
    create: {
      handle: "chris_code",
    },
  },
  {
    where: { handle: "olivia.art" },
    update: {},
    create: {
      handle: "olivia.art",
    },
  },
  {
    where: { handle: "liam_dev" },
    update: {},
    create: {
      handle: "liam_dev",
    },
  },
  {
    where: { handle: "noah_music" },
    update: {},
    create: {
      handle: "noah_music",
    },
  },
  {
    where: { handle: "zoe_sings" },
    update: {},
    create: {
      handle: "zoe_sings",
    },
  },
];

async function main() {
  for (const u of userUpserts) {
    await prisma.user.upsert(u);
  }
  const bob = await prisma.user.findFirst({
    where: { handle: "bob_builder" },
  });
  const alice = await prisma.user.findFirst({
    where: { handle: "alice_w" },
  });
  // const result = await prisma.follow.create({
  //   data: {
  //     followingId: bob!.id,
  //     followedById: alice!.id,
  //   },
  // });
}

try {
  await main();
  await prisma.$disconnect();
} catch (error) {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
}
