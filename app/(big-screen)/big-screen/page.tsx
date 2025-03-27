import { prisma } from "@/lib/prisma";
import StretchGoals from "@/components/StretchGoals";
import Vipps from "@/components/Vipps/Vipps";
import NewActivities from "@/components/home/NewActivities";
import AutoRefresh from "./AutoRefresh";

export const dynamic = "force-dynamic";

export default async function BigScreenPage() {
  const prizeGoals = await prisma.prizeGoal.findMany();
  const collected = await prisma.collected.findMany();

  const biggestSpenderGroup = await prisma.collected.groupBy({
    by: ["nameOfBidder"],
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
    take: 1,
  });

  const biggestSpenderData = biggestSpenderGroup[0] || null;

  const biggestSpender = biggestSpenderData
    ? {
        nameOfBidder: biggestSpenderData.nameOfBidder,
        totalAmount: biggestSpenderData._sum.amount,
      }
    : null;

  const vippsCollected = await prisma.collected.findMany({
    where: {
      type: "VIPPS",
    },
    orderBy: {
      order: "desc",
    },
    take: 10,
  });

  const bids = await prisma.bid.findMany({
    include: {
      Auction: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 15,
  });

  return (
    <AutoRefresh intervalInMinutes={2.5}>
      <div className="flex flex-row justify-center w-full h-full">
        <div className="mr-4 h-full w-full flex flex-col justify-start">
          <StretchGoals prizeGoals={prizeGoals} collected={collected} />

          <NewActivities bids={bids} lessMt />
        </div>
        <div className="ml-4 h-full w-2/5">
          <Vipps collected={vippsCollected} topDonor={biggestSpender} />
        </div>
      </div>
    </AutoRefresh>
  );
}
