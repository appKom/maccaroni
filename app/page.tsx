import StretchGoals from "../components/StretchGoals";
import SilentAuctionSlider from "../components/SilentAuctionSlider";
import PagesButtons from "../components/PagesButtons";
import Vipps from "../components/Vipps";
import ProgressBar from "../components/ProgressBar";

export default function Index() {
  const data = {
    stretchGoals: [
      { id: 1, goal: 1, description: "Goal 1", amount: 1000 },
      { id: 2, goal: 2, description: "Goal 2", amount: 2000 },
      { id: 3, goal: 3, description: "Goal 3", amount: 3000 },
    ],
    totalAmount: 1500,
    auctions: [
      { id: 1, title: "Auction Item 1", price: 100, highestBid: 100 },
      { id: 2, title: "Auction Item 2", price: 200, highestBid: 200 },
      { id: 3, title: "Auction Item 3", price: 300, highestBid: 300 },
    ],
    vipps: [
      { id: 1, name: "Donor 1", amount: 100 },
      { id: 2, name: "Donor 2", amount: 200 },
      { id: 3, name: "Donor 3", amount: 300 },
    ],
    topDonor: { name: "Top Donor", amount: 500 },
  };

  return (
    <>
      <div className={"flex h-screen flex-wrap justify-center"}>
        <div
          className={
            " w-screen sm:w-3/4 p-5 flex text-5xl bg-emerald-400 flex-wrap"
          }
        >
          Veldedighetsfest 2023 <PagesButtons />
          <hr />
        </div>
        <div className={"w-screen"}>
          <ProgressBar
            stretchGoals={data.stretchGoals}
            totalAmount={data.totalAmount}
          />
        </div>

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

        <div className={"w-screen"}>
          <SilentAuctionSlider items={data.auctions} />
        </div>
        <div className={"m-10"}>
          <p className={"m-10"}> </p>
        </div>
        <div className="grid grid-cols-2 gap-2 w-screen mt-[8vw] mb-[8vw] sm:px-[10rem] px-[3rem]">
          <img
            src="./sopra.png"
            className="col-span-1 object-contain shadow rounded border-none"
          ></img>
          <img
            src="./bekk.webp"
            className="col-span-1 object-contain shadow rounded border-none"
          ></img>
          <img
            src="./tieto.png"
            className="col-span-1 object-contain shadow rounded border-none"
          ></img>
          <img
            src="./visma.png"
            className="col-span-1 object-contain shadow rounded border-none"
          ></img>
        </div>
      </div>
    </>
  );
}
