/*
  Warnings:

  - You are about to drop the column `authorAvatar` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `authorName` on the `Comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "authorAvatar",
DROP COLUMN "authorName",
ALTER COLUMN "clap" DROP NOT NULL;
