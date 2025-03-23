import { prisma } from "@/lib/prisma";
import StretchGoals from "@/components/StretchGoals";
import Vipps from "@/components/Vipps";

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

  return (
    <div className="flex flex-row items-center justify-center w-full h-full">
      <div className="mr-4 h-full w-full">
      <StretchGoals prizeGoals={prizeGoals} collected={collected}/>
      </div>
      <div className="ml-4 h-full w-2/5">   
        <Vipps items={data.vipps} topDonor={data.vipps[2]} />
      </div>
    </div>
  );
}