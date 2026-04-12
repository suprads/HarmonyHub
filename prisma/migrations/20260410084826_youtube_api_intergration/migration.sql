-- CreateTable
CREATE TABLE "YoutubeMusicAccount" (
    "id" BIGSERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "cookie" TEXT NOT NULL,
    "authorization" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YoutubeMusicAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "YoutubeMusicAccount_userId_key" ON "YoutubeMusicAccount"("userId");

-- AddForeignKey
ALTER TABLE "YoutubeMusicAccount" ADD CONSTRAINT "YoutubeMusicAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
