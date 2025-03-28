import { prisma } from "@/lib/prisma";
import StretchGoals from "@/components/StretchGoals";
import Vipps from "@/components/Vipps/Vipps";
import AutoRefresh from "./AutoRefresh";
import OnloveBanner from "./OnloveBanner";
import "./big-screen.css";
import BigScreenNewActivites from "./BigScreenNewActivities";

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
    <AutoRefresh intervalInMinutes={1}>
      <div className="flex flex-row justify-center w-full h-full overflow-hidden overflow-y-hidden">
        <div className="mr-4 h-full w-full flex flex-col justify-start">
          <OnloveBanner />
          <StretchGoals
            prizeGoals={prizeGoals}
            collected={collected}
            biggerText
          />

          <BigScreenNewActivites bids={bids} lessMt />
        </div>
        <div className="ml-4 h-full w-3/7">
          <Vipps
            collected={vippsCollected}
            topSpenders={topSpenders}
            myTotal={0}
          />
        </div>
      </div>
    </AutoRefresh>
  );
}
