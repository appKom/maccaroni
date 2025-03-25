"use client";

import { useState, useEffect } from "react";
import type { Collected } from "@prisma/client";
import { DonationCard } from "./DonationCard";
import QRCode from "./QRCode";

interface VippsProps {
  collected: Collected[];
  topDonor: Collected | null;
}

export default function Vipps({ collected, topDonor }: VippsProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();

    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const displayedDonations = isMobile ? collected.slice(0, 6) : collected;

  return (
    <div className="flex flex-col space-y-8 max-w-md mx-auto w-full">
      {topDonor && (
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold text-purple-100">
            Største donasjon
          </h2>
          <DonationCard
            name={topDonor.nameOfBidder}
            amount={topDonor.amount}
            variant="top"
          />
        </section>
      )}

      <section className="bg-white/5 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-purple-100">
          Scan QR-koden for Vipps
        </h2>
        <QRCode />
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-semibold text-purple-100">
          Siste donasjoner
          {isMobile && collected.length > 6 && (
            <span className="text-sm font-normal ml-2">
              ({displayedDonations.length} av {collected.length})
            </span>
          )}
        </h2>

        <div className="space-y-3">
          {displayedDonations && displayedDonations.length > 0 ? (
            displayedDonations.map((item) => (
              <DonationCard
                key={item.id}
                name={item.nameOfBidder}
                amount={item.amount}
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
