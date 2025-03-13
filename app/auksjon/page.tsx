"use client";

import { useState, useEffect } from "react";
import AuctionItemCard from "@/components/AuctionItemCard";

interface Bid {
  id: string;
  amount: number;
  nameOfBidder: string;
  auctionId: string;
}

interface Auction {
  id: string;
  name: string;
  description: string;
  startPrice: number;
  minimumIncrease: number;
  image: string | null;
  bids: Bid[];
}

export default function AuctionItemsPage() {
  const [items, setItems] = useState<Auction[]>([]);
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
    nameOfBidder: string
  ) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === auctionId) {
          const newBid: Bid = {
            id: `temp-${Date.now()}`,
            amount,
            nameOfBidder,
            auctionId,
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

  const getHighestBid = (bids: Bid[]) => {
    if (bids.length === 0) return 0;
    return Math.max(...bids.map((bid) => bid.amount));
  };

  return (
    <main className="mx-auto flex flex-col items-center container px-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 w-full">
        {items.map((item) => (
          <AuctionItemCard
            key={item.id}
            title={item.name}
            startPrice={item.startPrice}
            highestBid={getHighestBid(item.bids)}
            minIncrease={item.minimumIncrease}
            description={item.description}
            image={item.image ? item.image : "/Online_hvit_o.svg"}
            auctionId={item.id}
            onBidSubmitted={handleBidSubmitted}
          />
        ))}
      </div>
    </main>
  );
}
