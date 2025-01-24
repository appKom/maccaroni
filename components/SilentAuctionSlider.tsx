import styles from "./SilentAuctionSlider.module.css";

interface Props {
  items: {
    id: number;
    title: string;
    price: number;
    highestBid: number;
  }[];
}

const SilentAuctionSlider = ({ items }: Props) => {
  items = items.sort((a, b) => {
    return a.price - b.price;
  });

  const itemRows = items.map((item, index) => (
    <tr key={index}>
      <td className="m-1 text-2xl">{item.title}</td>
      <td className="m-1 text-2xl">{item.price},-</td>
      <td className="m-1 text-2xl">{item.highestBid}</td>
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
            <th className="m-1 text-lg sm:text-3xl ">Auksjon</th>
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
