"use client";

import { useEffect, useState } from "react";
import AuctionItemCard from "@/components/AuctionItemCard";

interface BidType {
  id: string;
  amount: number;
  nameOfBidder: string;
  auctionId: string;
}

interface AuctionType {
  id: string;
  name: string;
  description: string;
  minimumIncrease: number;
  startPrice: number;
  bids: BidType[];
}

export default function AuctionItemsPage() {
  const [auctions, setAuctions] = useState<AuctionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await fetch("/api/auctions");
        const data = await response.json();
        setAuctions(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch auctions:", error);
      }
    };

    fetchAuctions();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-grow">
      <div className="max-w-8x1 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center flex-wrap gap-8">
          {auctions.map((auction) => {
            const highestBid = auction.bids && auction.bids.length > 0
              ? Math.max(...auction.bids.map(bid => bid.amount))
              : auction.startPrice;

            return (
              <AuctionItemCard
                key={auction.id}
                id={auction.id}
                title={auction.name}
                highestBid={highestBid}
                minIncrease={auction.minimumIncrease}
                description={auction.description}
                image="/Online_hvit_o.svg" // Replace with actual image if available
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
