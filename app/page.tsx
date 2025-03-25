import Vipps from "../components/Vipps";
import { prisma } from "@/lib/prisma";
import SilentAuctionTable from "@/components/SilentAuctionTable";
import StretchGoals from "@/components/StretchGoals";
import MentalHelseBanner from "@/components/home/MentalHelseBanner";
import NewActivities from "@/components/home/NewActivities";

export default async function Index() {
  const data = {
    vipps: [
      { id: 1, name: "Donor 1", amount: 100 },
      { id: 2, name: "Donor 2", amount: 200 },
      { id: 3, name: "Donor 3", amount: 300 },
    ],
  };

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
            <Vipps items={data.vipps} topDonor={data.vipps[2]} />

            <NewActivities bids={bids} />
          </section>
        </div>
      </div>
    </>
  );
}
