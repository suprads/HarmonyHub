/*
  Warnings:

  - The values [APPLE,SOUNDCLOUD] on the enum `Provider` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `lastLoginAt` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `artistId` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[albumId,releaseDate,title]` on the table `Track` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Provider_new" AS ENUM ('SPOTIFY', 'YTMUSIC');
ALTER TABLE "TrackSource" ALTER COLUMN "provider" TYPE "Provider_new" USING ("provider"::text::"Provider_new");
ALTER TYPE "Provider" RENAME TO "Provider_old";
ALTER TYPE "Provider_new" RENAME TO "Provider";
DROP TYPE "public"."Provider_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_trackId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_userId_fkey";

-- DropForeignKey
ALTER TABLE "Track" DROP CONSTRAINT "Track_artistId_fkey";

-- DropIndex
DROP INDEX "Track_title_artistId_albumId_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "lastLoginAt";

-- AlterTable
ALTER TABLE "Track" DROP COLUMN "artistId",
ADD COLUMN     "genres" TEXT[],
ADD COLUMN     "releaseDate" TIMESTAMP(3),
ALTER COLUMN "explicit" DROP NOT NULL,
ALTER COLUMN "explicit" DROP DEFAULT;

-- DropTable
DROP TABLE "Like";

-- CreateTable
CREATE TABLE "History" (
    "userId" TEXT NOT NULL,
    "trackSourceId" BIGINT NOT NULL,
    "playedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "History_pkey" PRIMARY KEY ("userId","trackSourceId")
);

-- CreateTable
CREATE TABLE "_ArtistToTrack" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL,

    CONSTRAINT "_ArtistToTrack_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ArtistToTrack_B_index" ON "_ArtistToTrack"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Track_albumId_releaseDate_title_key" ON "Track"("albumId", "releaseDate", "title");

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_trackSourceId_fkey" FOREIGN KEY ("trackSourceId") REFERENCES "TrackSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtistToTrack" ADD CONSTRAINT "_ArtistToTrack_A_fkey" FOREIGN KEY ("A") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtistToTrack" ADD CONSTRAINT "_ArtistToTrack_B_fkey" FOREIGN KEY ("B") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;
