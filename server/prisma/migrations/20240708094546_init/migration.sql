/*
  Warnings:

  - You are about to drop the column `autherId` on the `Comment` table. All the data in the column will be lost.
  - Added the required column `authorAvatar` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorName` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_autherId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "autherId",
ADD COLUMN     "authorAvatar" TEXT NOT NULL,
ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "authorName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
