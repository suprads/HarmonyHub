import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTopItems, TopTrackResponse } from "@/services/spotify";
import { Provider } from "@/generated/prisma/client";

export async function POST(req: Request) {
  try {
    const { userId, accessToken } = await req.json();

    if (!userId || !accessToken) {
      return NextResponse.json(
        { error: "Missing userId or accessToken" },
        { status: 400 },
      );
    }

    let data: TopTrackResponse | undefined;

    try {
      // Fetch user top tracks from Spotify
      data = await getTopItems(accessToken, {
        type: "tracks",
        timeRange: "medium_term",
        limit: 20,
        offset: 0,
      });
    } catch (err) {
      if (err instanceof Error) {
        return NextResponse.json(
          { error: err?.message ?? "Spotify API error" },
          { status: 502 },
        );
      }
    }

    const items = data?.items ?? [];
    if (items.length === 0) {
      return NextResponse.json({ ingested: 0 });
    }

    let ingestedCount = 0;

    // Loop through tracks
    for (const track of items) {
      const spotifyTrackId = track.id;
      if (!spotifyTrackId) continue;

      // If already exist
      const existingSource = await prisma.trackSource.findUnique({
        where: {
          provider_providerTrackId: {
            provider: Provider.SPOTIFY,
            providerTrackId: spotifyTrackId,
          },
        },
        include: { track: true },
      });

      let dbTrackId: bigint;

      // Update existing Track
      if (existingSource) {
        await prisma.track.update({
          where: { id: existingSource.trackId },
          data: {
            title: track.name,
            durationMs: track.duration_ms,
            explicit: track.explicit ?? false,
          },
        });

        dbTrackId = existingSource.trackId;
      } else {
        // Create/Upsert Artist
        const primaryArtist = track.artists?.[0];
        const artistName = primaryArtist?.name || "Unknown Artist";

        const artist = await prisma.artist.upsert({
          where: { name: artistName },
          update: {},
          create: {
            name: artistName,
          },
        });

        // Create Album
        const albumData = track.album;
        const albumTitle = albumData?.name || "Unknown Album";

        const releaseDateStr = albumData?.release_date;
        let releaseDate: Date | null = null;
        if (releaseDateStr) {
          const parts = releaseDateStr.split("-");
          if (parts.length === 1) {
            releaseDate = new Date(Number(parts[0]), 0);
          } else if (parts.length === 2) {
            releaseDate = new Date(Number(parts[0]), Number(parts[1]) - 1);
          } else {
            releaseDate = new Date(releaseDateStr);
          }
        }

        const album = await prisma.album.create({
          data: {
            title: albumTitle,
            releaseDate,
          },
        });

        // Create Track
        const createdTrack = await prisma.track.create({
          data: {
            title: track.name,
            durationMs: track.duration_ms,
            explicit: track.explicit ?? false,
            artistId: artist.id,
            albumId: album.id,
          },
        });

        dbTrackId = createdTrack.id;

        // Link TrackSource to Track (SPOTIFY)
        await prisma.trackSource.create({
          data: {
            provider: Provider.SPOTIFY,
            providerTrackId: spotifyTrackId,
            raw: track,
            trackId: dbTrackId,
          },
        });
      }

      // Record Likes  User to Track relation
      await prisma.like.upsert({
        where: {
          userId_trackId: {
            userId,
            trackId: dbTrackId,
          },
        },
        update: {},
        create: {
          userId,
          trackId: dbTrackId,
        },
      });

      ingestedCount++;
    }

    return NextResponse.json({ ingested: ingestedCount }, { status: 200 });
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      return NextResponse.json(
        { error: err?.message || "Internal server error" },
        { status: 500 },
      );
    }
  }
}
