-- CreateTable
CREATE TABLE "PrizeGoal" (
    "id" TEXT NOT NULL,
    "goal" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "totalCollected" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PrizeGoal_pkey" PRIMARY KEY ("id")
);
