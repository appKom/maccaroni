import SilentAuctionSlider from "../components/SilentAuctionSlider";
import Vipps from "../components/Vipps";
import ProgressBar from "../components/ProgressBar";
import { prisma } from "@/lib/prisma";

export default async function Index() {
  const data = {
    stretchGoals: [
      { id: 1, goal: 1, description: "Goal 1", amount: 1000 },
      { id: 2, goal: 2, description: "Goal 2", amount: 2000 },
      { id: 3, goal: 3, description: "Goal 3", amount: 3000 },
    ],
    totalAmount: 1500,

    vipps: [
      { id: 1, name: "Donor 1", amount: 100 },
      { id: 2, name: "Donor 2", amount: 200 },
      { id: 3, name: "Donor 3", amount: 300 },
    ],
    topDonor: { name: "Top Donor", amount: 500 },
  };

  const auctions = await prisma.auction.findMany({
    include: {
      bids: true,
    },
  });

  const prizeGoals = await prisma.prizeGoal.findMany();

  return (
    <>
      <div className={"flex flex-col mx-auto container px-4"}>
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 pt-8 ">
          <section className="col-span-5 flex flex-col items-center">
            <ProgressBar prizeGoals={prizeGoals} />
            <SilentAuctionSlider auctions={auctions} />
          </section>

          <section className="col-span-2">
            <Vipps items={data.vipps} />
          </section>
        </div>
      </div>
    </>
  );
}
