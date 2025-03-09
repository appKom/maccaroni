import { prisma } from "@/lib/prisma";
import AuctionItemCard from "@/components/AuctionItemCard";

export default async function AuctionItemsPage() {
  const items = await prisma.auction.findMany({
    include: {
      bids: true,
    },
  });

  const highestBid = items.map((item) => {
    if (item.bids.length === 0) {
      return { auctionId: item.id, amount: 0 };
    }
    return item.bids.reduce((prev, current) =>
      prev.amount > current.amount ? prev : current
    );
  });

  if (!items || items.length === 0) {
    return <p>Fant ingen auksjoner :(</p>;
  }

  return (
    <main className="mx-auto flex flex-col items-center container px-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 w-full">
        {items.map((item) => (
          <AuctionItemCard
            key={item.id}
            title={item.name}
            highestBid={
              highestBid.find((bid) => bid.auctionId === item.id)?.amount || 0
            }
            minIncrease={item.minimumIncrease}
            description={item.description}
            image="/Online_hvit_o.svg"
          />
        ))}
      </div>
    </main>
  );
}
