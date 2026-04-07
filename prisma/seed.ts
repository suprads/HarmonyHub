import type { Provider } from "@/generated/prisma/enums";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/services/db/notification";

const exampleUser = {
  id: "",
  name: "Name",
  email: "email@example.com",
  emailVerified: false,
  password: "password",
  handle: "example",
};
const sunLoverUser = {
  id: "",
  name: "Sun Lover",
  email: "sunlover63@example.com",
  emailVerified: false,
  password: "password123",
  handle: "sunlover63",
};
const johnUser = {
  id: "",
  name: "John Doe",
  email: "john345@example.com",
  emailVerified: false,
  password: "johnnyDoo4",
  handle: "john345",
};
const pixelUser = {
  id: "",
  name: "Pixel Pioneer",
  email: "pixelpioneer@example.com",
  emailVerified: false,
  password: "pixelpassword",
  handle: "pixelpioneer",
};
const guitarUser = {
  id: "",
  name: "Guitar Hero",
  email: "guitar_hero21@example.com",
  emailVerified: false,
  password: "heroboy2",
  handle: "guitar_hero21np",
};

const users = [exampleUser, sunLoverUser, johnUser, pixelUser, guitarUser];

async function seedAlbum(title: string, releaseDate: Date, id?: number) {
  return await prisma.album.upsert({
    where: { id },
    update: {},
    create: { id, title, releaseDate },
  });
}

async function seedGenre(name: string) {
  return await prisma.genre.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}

async function seedHistory(
  userId: string,
  trackSourceId: bigint,
  playedAt?: Date,
) {
  return await prisma.history.upsert({
    where: { userId_trackSourceId: { userId, trackSourceId } },
    update: {},
    create: { userId, trackSourceId, playedAt },
  });
}

async function seedTrack(
  title: string,
  albumId: bigint,
  releaseDate: Date,
  durationMs?: number,
  explicit?: boolean,
  sources: { provider: Provider; providerTrackId: string }[] = [],
  genres: string[] = [],
) {
  return await prisma.track.upsert({
    where: {
      albumId_releaseDate_title: {
        albumId,
        releaseDate,
        title,
      },
    },
    update: {},
    create: {
      title,
      albumId,
      durationMs,
      explicit,
      releaseDate,
      artists: { create: { name: "The Beatles" } },
      genres: {
        connectOrCreate: genres.map((name) => ({
          create: { name },
          where: { name },
        })),
      },
      sources: { create: sources },
    },
    include: { sources: true },
  });
}

async function main() {
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const currentUser = await prisma.user.findFirst({
      select: { id: true },
      where: { email: user.email },
    });

    if (!currentUser) {
      const result = await auth.api.signUpEmail({
        body: user,
      });
      // Need to set ID so it is accurate for later seeding steps.
      users[i].id = result.user.id;
    } else {
      users[i].id = currentUser.id;
      console.log(`User with email ${user.email} already exists.`);
    }
  }

  const friendReq = await prisma.friendRequest.upsert({
    where: {
      senderId_receiverId: {
        senderId: sunLoverUser.id,
        receiverId: exampleUser.id,
      },
    },
    update: {},
    create: {
      senderId: sunLoverUser.id,
      receiverId: exampleUser.id,
    },
  });

  if (friendReq) {
    await createNotification("FRIEND_REQUEST", [
      sunLoverUser.id,
      exampleUser.id,
    ]);
  }

  // Data used in seeds below was initially generated using Github Copilot.

  const album1 = await seedAlbum("Abbey Road", new Date("1969-09-26"), 1);
  const album2 = await seedAlbum("21", new Date("2011-01-24"), 2);
  const albumTest = await seedAlbum("Test Album", new Date("1969-01-01"), 3);

  const genreRock = await seedGenre("rock");
  const genrePop = await seedGenre("pop");
  const genreJazz = await seedGenre("jazz");

  const track1 = await seedTrack(
    "Come Together",
    album1.id,
    new Date("1969-09-26"),
    259000,
    false,
    [{ provider: "SPOTIFY", providerTrackId: "spotify_track_1" }],
    [genreRock.name],
  );
  const track2 = await seedTrack(
    "Someone Like You",
    album2.id,
    new Date("2011-01-24"),
    285000,
    false,
    [{ provider: "YTMUSIC", providerTrackId: "ytmusic_track_2" }],
    [genrePop.name],
  );
  const trackTest = await seedTrack(
    "Test Track",
    albumTest.id,
    new Date("1969-01-01"),
    100000,
    false,
    [{ provider: "SPOTIFY", providerTrackId: "spotify_test_track" }],
    [genrePop.name, genreJazz.name],
  );

  await seedHistory(
    exampleUser.id,
    track1.sources[0].id,
    new Date("2012-01-01"),
  );
  await seedHistory(exampleUser.id, track2.sources[0].id);
  await seedHistory(exampleUser.id, trackTest.sources[0].id);
  await seedHistory(sunLoverUser.id, track1.sources[0].id);
}

try {
  await main();
  await prisma.$disconnect();
} catch (error) {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
}
