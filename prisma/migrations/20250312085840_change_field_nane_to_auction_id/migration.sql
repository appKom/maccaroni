/*
  Warnings:

  - You are about to drop the column `bidId` on the `Collected` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Collected" DROP COLUMN "bidId",
ADD COLUMN     "auctionId" TEXT;
