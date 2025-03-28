"use client";

import { useState, useEffect } from "react";
import AuctionItemCard from "@/components/AuctionItemCard";
import { Auction, Bid } from "@prisma/client";
import { CountdownBanner } from "@/components/CountdownBanner";
import { endDate, targetDate } from "@/lib/constants";

export default function AuctionItemsPage() {
  const [items, setItems] = useState<(Auction & { bids: Bid[] })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await fetch("/api/auctions");
        if (response.ok) {
          const data = await response.json();
          setItems(data);
        } else {
          console.error("Failed to fetch auctions");
        }
      } catch (error) {
        console.error("Error fetching auctions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  const handleBidSubmitted = (
    auctionId: string,
    amount: number,
    nameOfBidder: string,
    owId: string,
    emailOfBidder: string
  ) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === auctionId) {
          const newBid: Bid = {
            id: `temp-${Date.now()}`,
            amount,
            nameOfBidder,
            auctionId,
            owId,
            emailOfBidder,
            createdAt: new Date(),
          };

          return {
            ...item,
            bids: [...item.bids, newBid],
          };
        }
        return item;
      })
    );
  };

  if (loading) {
    return (
      <div className="flex-grow min-h-[60vh] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-y-2  mb-4"></div>
          <h2 className="text-2xl font-semibold">
            Laster inn veldedighetsfesten...
          </h2>
          <p className="text-slate-400 mt-2">
            Vennligst vent mens vi henter informasjonen din
          </p>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return <p>Fant ingen auksjoner :(</p>;
  }

  const getHighestBid = (bids: Bid[]): Bid | null => {
    if (bids.length === 0) return null;
    return bids.reduce(
      (highest, bid) => (bid.amount > highest.amount ? bid : highest),
      bids[0]
    );
  };

  const now = Date.now();
  const beforeAuction = now < targetDate.getTime();
  const msUntilEnd = endDate.getTime() - now;
  const withinOneHourOfEnd = msUntilEnd <= 60 * 60 * 1000 && msUntilEnd > 0;
  const showCountdown = beforeAuction || withinOneHourOfEnd;

  return (
    <main className="mx-auto flex flex-col items-center container px-4 md:px-8">
      {showCountdown && (
        <CountdownBanner
          title={
            beforeAuction
              ? "Stilleauksjonen åpner igjen om:"
              : "Stilleauksjonen er ferdig om:"
          }
        />
      )}

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 w-full">
        {items.map((item) => (
          <AuctionItemCard
            key={item.id}
            auction={item}
            highestBid={getHighestBid(item.bids)}
            onBidSubmitted={handleBidSubmitted}
          />
        ))}
      </div>
    </main>
  );
}
