import Link from "next/link";
import AuctionItems from "@/components/AuctionItems";

const NavBar = () => (
  <div className="w-full p-10">
    <Link href="/">
      <button className="mb-2 mt-2 bg-yellow hover:bg-regalblue hover:text-beige text-gray-800 font-semibold py-2 px-10  rounded shadow text-2xl">
        Tilbake til hovedsiden
      </button>
    </Link>
  </div>
);

export default function AuctionItemsPage() {
  const data = {
    auctions: [
      {
        id: 1,
        title: "Auction Item 1",
        price: 100,
        highestBid: "100",
        description: "Description 1",
        _id: "1",
      },
      {
        id: 2,
        title: "Auction Item 2",
        price: 200,
        highestBid: "200",
        description: "Description 2",
        _id: "2",
      },
      {
        id: 3,
        title: "Auction Item 3",
        price: 300,
        highestBid: "300",
        description: "Description 3",
        _id: "3",
      },
    ],
  };

  return (
    <div>
      <NavBar />
      <AuctionItems items={data.auctions} />
    </div>
  );
}
