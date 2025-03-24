/*
  Warnings:

  - Added the required column `type` to the `Collected` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CollectedType" AS ENUM ('SILENT_AUCTION', 'LIVE_AUCTION', 'VIPPS');

-- AlterTable
ALTER TABLE "Collected" ADD COLUMN     "type" "CollectedType" NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;
