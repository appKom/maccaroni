"use client";

import Link from "next/link";
import AuctionItemCard from "@/components/AuctionItemCard";

export default function AuctionItemsPage() {
  return (
    <div>
      <div className="flex flex-row flex-wrap justify-evenly pt-10 mx-10">
        <AuctionItemCard />
        <AuctionItemCard />
        <AuctionItemCard />
      </div>
    </div>
  );
}
