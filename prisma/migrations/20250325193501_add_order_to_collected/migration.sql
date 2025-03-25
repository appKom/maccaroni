/*
  Warnings:

  - A unique constraint covering the columns `[order]` on the table `Collected` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Collected" ADD COLUMN     "order" SERIAL;

-- CreateIndex
CREATE UNIQUE INDEX "Collected_order_key" ON "Collected"("order");
