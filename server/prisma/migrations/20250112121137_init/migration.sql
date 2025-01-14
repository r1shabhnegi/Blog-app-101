-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "postCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "TagFollow" (
    "id" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TagFollow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TagFollow_userId_tagId_key" ON "TagFollow"("userId", "tagId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_tag_fkey" FOREIGN KEY ("tag") REFERENCES "Tag"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagFollow" ADD CONSTRAINT "TagFollow_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagFollow" ADD CONSTRAINT "TagFollow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
