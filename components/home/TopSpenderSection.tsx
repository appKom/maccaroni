import { BiggestSpenderCard } from "../Vipps/BiggestSpenderCard";
import { RunnerUpSpenderCard } from "../Vipps/RunnerUpSpenderCard";

interface TopSpendersProps {
  topSpenders: {
    nameOfBidder: string;
    totalAmount: number | null;
  }[];
}

export function TopSpendersSection({ topSpenders }: TopSpendersProps) {
  if (!topSpenders || topSpenders.length === 0) return null;

  return (
    <section className="space-y-4">
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
