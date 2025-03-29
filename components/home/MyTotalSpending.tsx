import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import { CoinsIcon } from "lucide-react";
import { getServerSession } from "next-auth";

const MyTotalSpending = async () => {
  const session = await getServerSession(authOptions);

  const myTotalAggregate = await prisma.collected.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      nameOfBidder: session?.user?.name,
    },
  });

  const myTotal = myTotalAggregate._sum.amount || 0;

  if (myTotal <= 0) {
    return null;
  }

  return (
    <div className="flex flex-col ">
      <h2 className="text-3xl pb-2 font-semibold text-purple-100">
        Ditt totale bidrag
      </h2>
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-blue-900 p-5 rounded-lg shadow-lg border border-blue-500">
        <div className="absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 bg-blue-500 rounded-full opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 -ml-4 -mb-4 bg-blue-800 rounded-full opacity-20"></div>

        <div className="flex items-center justify-between">
          <p className="text-3xl font-bold text-white">
            {myTotal.toLocaleString("no-NO")} kr
          </p>

          <div className="bg-blue-800 p-3 rounded-full">
            <CoinsIcon className="h-8 w-8 text-yellow-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTotalSpending;
