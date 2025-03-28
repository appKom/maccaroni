import Vipps from "../../components/Vipps/Vipps";
import { prisma } from "@/lib/prisma";
import SilentAuctionTable from "@/components/SilentAuctionTable";
import StretchGoals from "@/components/StretchGoals";
import MentalHelseBanner from "@/components/home/MentalHelseBanner";
import NewActivities from "@/components/home/NewActivities";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";

export default async function Index() {
  const session = await getServerSession(authOptions);

  const prizeGoals = await prisma.prizeGoal.findMany();

  const collected = await prisma.collected.findMany();

  const collectedWithVippsAndSiltent = collected.filter(
    (item) => item.type !== "VIPPS" && item.type !== "SILENT_AUCTION"
  );

  const auctions = await prisma.auction.findMany({
    include: {
      bids: true,
    },
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

  const myTotalAggregate = await prisma.collected.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      nameOfBidder: session?.user?.name,
    },
  });

  const myTotal = myTotalAggregate._sum.amount || 0;

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

  return (
    <>
      <div className={"flex flex-col mx-auto container px-4"}>
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 pt-8">
          <section className="col-span-1 lg:col-span-5 flex flex-col items-center order-2 lg:order-1">
            <MentalHelseBanner />
            <StretchGoals prizeGoals={prizeGoals} collected={collected} />
            <SilentAuctionTable
              collections={collectedWithVippsAndSiltent}
              auctions={auctions}
            />
          </section>
          <section className="col-span-1 lg:col-span-2 w-full order-1 lg:order-2">
            <Vipps
              collected={vippsCollected}
              topSpenders={topSpenders}
              myTotal={myTotal}
            />

            <div className="lg:block hidden">
              <NewActivities bids={bids} />
            </div>
          </section>

          <section className="col-span-1 lg:col-span-7 w-full order-3 lg:hidden">
            <NewActivities bids={bids} />
          </section>
        </div>
      </div>
    </>
  );
}
