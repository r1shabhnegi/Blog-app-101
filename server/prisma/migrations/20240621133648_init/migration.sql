/*
  Warnings:

  - You are about to drop the `_readingHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_readingHistory" DROP CONSTRAINT "_readingHistory_A_fkey";

-- DropForeignKey
ALTER TABLE "_readingHistory" DROP CONSTRAINT "_readingHistory_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "readingHistory" TEXT[];

-- DropTable
DROP TABLE "_readingHistory";
