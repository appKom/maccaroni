import { CoinsIcon } from "lucide-react";
import { BiggestSpenderCard } from "./BiggestSpenderCard";
import { RunnerUpSpenderCard } from "./RunnerUpSpenderCard";

interface TopSpendersProps {
  topSpenders: {
    nameOfBidder: string;
    totalAmount: number | null;
  }[];
  myTotal: number;
}

export function TopSpendersSection({ topSpenders, myTotal }: TopSpendersProps) {
  if (!topSpenders || topSpenders.length === 0) return null;

  return (
    <section className="space-y-4">
      {myTotal === 0 ? (
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
      ) : null}

      <h2 className="text-3xl font-semibold text-purple-100">
        Største bidragsytere
      </h2>

      <div className="space-y-3">
        {topSpenders[0] && (
          <BiggestSpenderCard
            name={topSpenders[0].nameOfBidder}
            amount={topSpenders[0].totalAmount}
          />
        )}

        {topSpenders[1] && (
          <RunnerUpSpenderCard
            name={topSpenders[1].nameOfBidder}
            amount={topSpenders[1].totalAmount}
            position={2}
          />
        )}

        {topSpenders[2] && (
          <RunnerUpSpenderCard
            name={topSpenders[2].nameOfBidder}
            amount={topSpenders[2].totalAmount}
            position={3}
          />
        )}
      </div>
    </section>
  );
}
