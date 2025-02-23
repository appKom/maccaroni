"use client";

import Link from "next/link";
import AuctionItemCard from "@/components/AuctionItemCard";

export default function AuctionItemsPage() {
  return (
    <div className="flex-grow">
      <div className="flex justify-center pt-10 mx-10">
        <AuctionItemCard
          title="Egen side på infoskjermen"
          highestBid={100}
          minIncrease={10}
          description="Hvem vil vel ikke ha en egen tide på inforskjermen på A4. Nå har du muligheten til å få akuratt det!"
          image="/Online_hvit_o.svg"
        />
        <AuctionItemCard
          title="Date med Dina"
          highestBid={200}
          minIncrease={20}
          description="Nå har du muligheten til å gå på en fantastisk date med Dina! Dette er en unik mulighet som du ikke vil gå glipp av!"
          image="/Online_hvit_o.svg"
        />
        <AuctionItemCard
          title="Egen drikkelek i appen"
          highestBid={300}
          minIncrease={30}
          description="Vil du har en egen drikkelek i appen til ære for deg?"
          image="/Online_hvit_o.svg"
        />
      </div>
    </div>
  );
}
