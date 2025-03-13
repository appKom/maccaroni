/*
  Warnings:

  - Added the required column `nameOfBidder` to the `Collected` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Collected" ADD COLUMN     "nameOfBidder" TEXT NOT NULL;
