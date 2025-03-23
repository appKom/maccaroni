import { prisma } from "@/lib/prisma";
import StretchGoals from "@/components/StretchGoals";

export default async function BigScreenPage() {
  const prizeGoals = await prisma.prizeGoal.findMany();
  const collected = await prisma.collected.findMany();

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <StretchGoals prizeGoals={prizeGoals} collected={collected} />
    </div>
  );
}