import { prisma } from "@/lib/prisma";
import StretchGoals from "@/components/home/StretchGoals";
import Vipps from "@/components/Vipps/Vipps";
import AutoRefresh from "./AutoRefresh";
import OnloveBanner from "./OnloveBanner";
import "./big-screen.css";
import BigScreenNewActivites from "./BigScreenNewActivities";
import { endDate } from "@/lib/constants";
import { CountdownBanner } from "@/components/CountdownBanner";
import { TopSpendersSection } from "@/components/home/TopSpenderSection";

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

  const now = Date.now();
  const msUntilEnd = endDate.getTime() - now;
  const withinOneHourOfEnd = msUntilEnd <= 60 * 60 * 1000 && msUntilEnd > 0;
  const showCountdown = withinOneHourOfEnd;

  return (
    <AutoRefresh intervalInMinutes={2.5}>
      <div className="flex flex-row justify-center w-full h-full overflow-hidden overflow-y-hidden">
        <div className="mr-4 h-full w-full flex flex-col justify-start">
          <OnloveBanner />

          {showCountdown && (
            <CountdownBanner title={"Stilleauksjonen er ferdig om:"} />
          )}

          <StretchGoals
            prizeGoals={prizeGoals}
            collected={collected}
            biggerText
          />

          <BigScreenNewActivites bids={bids} lessMt />
        </div>
        <div className="ml-4 h-full flex flex-col gap-4 spacy-y-4 w-3/7">
          <TopSpendersSection topSpenders={topSpenders} />
          <Vipps collected={vippsCollected} />
        </div>
      </div>
    </AutoRefresh>
  );
}
