/*
  Warnings:

  - You are about to drop the column `genres` on the `Track` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Track" DROP COLUMN "genres";

-- CreateTable
CREATE TABLE "Genre" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GenreToTrack" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL,

    CONSTRAINT "_GenreToTrack_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");

-- CreateIndex
CREATE INDEX "_GenreToTrack_B_index" ON "_GenreToTrack"("B");

-- AddForeignKey
ALTER TABLE "_GenreToTrack" ADD CONSTRAINT "_GenreToTrack_A_fkey" FOREIGN KEY ("A") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenreToTrack" ADD CONSTRAINT "_GenreToTrack_B_fkey" FOREIGN KEY ("B") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;
