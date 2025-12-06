import { prisma } from "@/lib/prisma";

async function main() {
  const sunLover = await prisma.user.upsert({
    where: { handle: "SunLover63" },
    update: {},
    create: {
      email: "sunlover63@example.com",
      handle: "SunLover63",
    },
  });
  const john = await prisma.user.upsert({
    where: { handle: "John345" },
    update: {},
    create: {
      email: "john345@example.com",
      handle: "John345",
    },
  });
  const pixel = await prisma.user.upsert({
    where: { handle: "PixelPioneer" },
    update: {},
    create: {
      email: "pixelpioneer@example.com",
      handle: "PixelPioneer",
    },
  });
  const guitarHero = await prisma.user.upsert({
    where: { handle: "guitar_hero21" },
    update: {},
    create: {
      email: "guitar_hero21@example.com",
      handle: "guitar_hero21",
    },
  });
  const coffeeCoder = await prisma.user.upsert({
    where: { handle: "coffeeCoder" },
    update: {},
    create: {
      email: "coffeecoder@example.com",
      handle: "coffeeCoder",
    },
  });
  console.log({ sunLover, john, pixel, guitarHero, coffeeCoder });
}

try {
  await main();
  await prisma.$disconnect();
} catch (e) {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}
