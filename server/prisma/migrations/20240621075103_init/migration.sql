/*
  Warnings:

  - Made the column `previewImage` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "previewImage" SET NOT NULL,
ALTER COLUMN "authorAvatar" DROP NOT NULL;
