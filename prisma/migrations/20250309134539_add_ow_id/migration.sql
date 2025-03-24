/*
  Warnings:

  - Added the required column `OwId` to the `Bid` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bid" ADD COLUMN     "OwId" TEXT NOT NULL;
