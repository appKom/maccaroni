import StretchGoals from "../components/StretchGoals";
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

  return (
    <>
      <div className={"flex flex-col"}>
        <ProgressBar
          stretchGoals={data.stretchGoals}
          totalAmount={data.totalAmount}
        />

        <div className="flex max-w-full flex-grow justify-evenly flex-wrap mt-10 text-beige">
          <div className={""}>
            <StretchGoals
              stretchGoals={data.stretchGoals}
              totalAmount={data.totalAmount}
            />
          </div>
          <div
            className={
              "flex-grow max-w-lg bg-regalblue rounded-md p-5 text-beige"
            }
          >
            <Vipps items={data.vipps} topDonor={data.topDonor} />
          </div>
        </div>

        <SilentAuctionSlider auctions={auctions} />
      </div>
    </>
  );
}
