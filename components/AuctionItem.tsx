interface Props {
  title: string;
  price: number;
  name: string;
  description: string;
  onClick: () => void;
}

const AuctionItem = ({ title, price, name, description, onClick }: Props) => {
  return (
    <div
      className="rounded overflow-hidden shadow-lg m-2 text-center px-3 py-2 cursor-pointer hover:bg-regalblue  "
      onClick={onClick}
      style={{
        background: "#2A9D8F",
        width: "20rem",
      }}
    >
      <div className="text-darkblue  font-bold text-2xl mb-2">{title}</div>
      <div className="text-darkblue font-bold text-2xl mb-2">{price},-</div>
      <span className="text-beige text-base mt-4 mb-4 text-2xl">
        <i>Høyeste budgiver: </i>
        {name}
      </span>
      <hr />
      <p className="text-black text-base mt-4 mb-4 text-2xl">{description}</p>
    </div>
  );
};

export default AuctionItem;
