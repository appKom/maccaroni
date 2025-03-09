import { Auction, Bid } from "@prisma/client";
import styles from "./SilentAuctionSlider.module.css";

interface AuctionWithBids extends Auction {
  bids: Bid[];
}

interface Props {
  auctions: AuctionWithBids[];
}

const SilentAuctionSlider = ({ auctions }: Props) => {
  const highestBid = (bids: Bid[]) => {
    if (bids.length === 0) {
      return null;
    }
    return bids.reduce((prev, current) =>
      prev.amount > current.amount ? prev : current
    );
  };

  const itemRows = auctions.map((item, index) => (
    <tr key={index}>
      <td className="m-1 text-2xl">{item.name}</td>
      <td className="m-1 text-2xl">{highestBid(item.bids)?.amount ?? 0}kr</td>
      <td className="m-1 text-2xl">
        {highestBid(item.bids)?.nameOfBidder ?? "Ingen bud"}
      </td>
    </tr>
  ));

  return (
    <div className={styles.wrapper}>
      <div className="m-1 text-4xl mb-2 mt-20 text-center">
        Enkel oversikt auksjoner
      </div>
      <table className={styles.tableMain}>
        <tbody>
          <tr className={styles.header}>
            <th className="m-1 text-lg sm:text-3xl">Auksjon</th>
            <th className="m-1 text-lg sm:text-3xl">Pris</th>
            <th className="m-1 text-lg sm:text-3xl">Høyeste budgiver</th>
          </tr>
          {itemRows}
        </tbody>
      </table>
    </div>
  );
};

export default SilentAuctionSlider;
