import type { Collected } from "@prisma/client";
import { DonationCard } from "./DonationCard";
import QRCode from "./QRCode";
import { BiggestSpenderCard } from "./BiggestSpenderCard";

interface VippsProps {
  collected: Collected[];
  topDonor: {
    nameOfBidder: string;
    totalAmount: number | null;
  } | null;
}

export default function Vipps({ collected, topDonor }: VippsProps) {
  return (
    <div className="flex flex-col space-y-8 mx-auto w-full">
      {topDonor && (
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold text-purple-100">
            Største bidragsyter
          </h2>
          <BiggestSpenderCard
            name={topDonor.nameOfBidder}
            amount={topDonor.totalAmount}
          />
        </section>
      )}

      <QRCode />

      <section className="space-y-4">
        <h2 className="text-3xl font-semibold text-purple-100">
          Siste donasjoner
        </h2>

        <div className="space-y-3">
          {collected && collected.length > 0 ? (
            collected.map((item) => (
              <DonationCard
                key={item.id}
                name={item.nameOfBidder}
                amount={item.amount}
                description={item.description}
              />
            ))
          ) : (
            <p className="text-purple-200 italic">Ingen donasjoner ennå</p>
          )}
        </div>
      </section>
    </div>
  );
}
