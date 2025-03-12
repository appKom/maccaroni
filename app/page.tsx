import Vipps from "../components/Vipps";
import { prisma } from "@/lib/prisma";
import SilentAuctionTable from "@/components/SilentAuctionTable";
import StretchGoals from "@/components/StretchGoals";

export default async function Index() {
  const data = {
    vipps: [
      { id: 1, name: "Donor 1", amount: 100 },
      { id: 2, name: "Donor 2", amount: 200 },
      { id: 3, name: "Donor 3", amount: 300 },
    ],
  };

  const auctions = await prisma.auction.findMany({
    include: {
      bids: true,
    },
  });

  const prizeGoals = await prisma.prizeGoal.findMany();

  const collected = await prisma.collected.findMany();

  return (
    <>
      <div className={"flex flex-col mx-auto container px-4"}>
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 pt-8 ">
          <section className="col-span-5 flex flex-col items-center">
            <StretchGoals prizeGoals={prizeGoals} collected={collected} />
            <SilentAuctionTable auctions={auctions} />
          </section>

          <section className="col-span-2">
            <Vipps items={data.vipps} />
          </section>
        </div>
      </div>
    </>
  );
}
