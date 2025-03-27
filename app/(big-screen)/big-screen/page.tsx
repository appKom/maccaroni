import { prisma } from "@/lib/prisma";
import StretchGoals from "@/components/StretchGoals";
import Vipps from "@/components/Vipps/Vipps";

export default async function BigScreenPage() {
  const prizeGoals = await prisma.prizeGoal.findMany();
  const collected = await prisma.collected.findMany();

  const data = {
    vipps: [
      { id: 1, name: "Donor 1", amount: 100 },
      { id: 2, name: "Donor 2", amount: 200 },
      { id: 3, name: "Donor 3", amount: 300 },
    ],
  };

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

  return (
    <div className="flex flex-row items-center justify-center w-full h-full">
      <div className="mr-4 h-full w-full">
      <StretchGoals prizeGoals={prizeGoals} collected={collected}/>
      </div>
      <div className="ml-4 h-full w-2/5">   
        <Vipps collected={vippsCollected} topDonor={biggestSpender} />
      </div>
    </div>
  );
}