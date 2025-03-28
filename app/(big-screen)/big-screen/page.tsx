import { prisma } from "@/lib/prisma";
import StretchGoals from "@/components/StretchGoals";
import Vipps from "@/components/Vipps/Vipps";
import NewActivities from "@/components/home/NewActivities";
import AutoRefresh from "./AutoRefresh";
import OnloveBanner from "./OnloveBanner";

export const dynamic = "force-dynamic";

export default async function BigScreenPage() {
  const prizeGoals = await prisma.prizeGoal.findMany();
  const collected = await prisma.collected.findMany();

  const topSpendersGroup = await prisma.collected.groupBy({
    by: ["nameOfBidder"],
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
    take: 3,
  });

  const topSpenders = topSpendersGroup.map((spender) => ({
    nameOfBidder: spender.nameOfBidder,
    totalAmount: spender._sum.amount,
  }));

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
          <OnloveBanner />
          <StretchGoals prizeGoals={prizeGoals} collected={collected} />

          <NewActivities bids={bids} lessMt />
        </div>
        <div className="ml-4 h-full w-2/5">
          <Vipps collected={vippsCollected} topSpenders={topSpenders} />
        </div>
      </div>
    </AutoRefresh>
  );
}
