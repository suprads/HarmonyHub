import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendFriendRequest } from "@/services/db/friend";
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

  const friendReq = await sendFriendRequest(sunLoverUser.id, exampleUser.id);
  if (friendReq) {
    await createNotification("FRIEND_REQUEST", [
      sunLoverUser.id,
      exampleUser.id,
    ]);
  }

  // The below seeding was initially generated using Github Copilot.

  const album1 = await prisma.album.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: "Abbey Road",
      releaseDate: new Date("1969-09-26"),
    },
  });
  const album2 = await prisma.album.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      title: "21",
      releaseDate: new Date("2011-01-24"),
    },
  });

  const track1 = await prisma.track.upsert({
    where: {
      albumId_releaseDate_title: {
        albumId: album1.id,
        releaseDate: new Date("1969-09-26"),
        title: "Come Together",
      },
    },
    update: {},
    create: {
      title: "Come Together",
      albumId: album1.id,
      durationMs: 259000,
      explicit: false,
      releaseDate: new Date("1969-09-26"),
      artists: { create: { name: "The Beatles" } },
      sources: {
        create: {
          provider: "SPOTIFY",
          providerTrackId: "spotify_track_1",
        },
      },
    },
    include: { sources: true },
  });
  const track2 = await prisma.track.upsert({
    where: {
      albumId_releaseDate_title: {
        albumId: album2.id,
        releaseDate: new Date("2011-01-24"),
        title: "Someone Like You",
      },
    },
    update: {},
    create: {
      title: "Someone Like You",
      albumId: album2.id,
      durationMs: 285000,
      explicit: false,
      releaseDate: new Date("2011-01-24"),
      artists: { create: { name: "Adele" } },
      sources: {
        create: {
          provider: "YTMUSIC",
          providerTrackId: "ytmusic_track_2",
        },
      },
    },
    include: { sources: true },
  });

  await prisma.history.upsert({
    where: {
      userId_trackSourceId: {
        userId: exampleUser.id,
        trackSourceId: track1.sources[0].id,
      },
    },
    update: {},
    create: {
      userId: exampleUser.id,
      trackSourceId: track1.sources[0].id,
      playedAt: new Date(),
    },
  });
  await prisma.history.upsert({
    where: {
      userId_trackSourceId: {
        userId: exampleUser.id,
        trackSourceId: track2.sources[0].id,
      },
    },
    update: {},
    create: {
      userId: exampleUser.id,
      trackSourceId: track2.sources[0].id,
    },
  });
}

try {
  await main();
  await prisma.$disconnect();
} catch (error) {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
}
