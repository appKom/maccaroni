interface Props {
  title: string;
  price: number;
  name: string;
  description: string;
  onClick: () => void;
  deletion: () => void;
}

const AuctionItem = ({ title, price, name, description, onClick, deletion }: Props) => {
  return (
    <div
      className="relative overflow-hidden m-2 text-center px-3 py-2 cursor-pointer bg-gradient-to-r from-[#f093fb] to-[#f5576c] shadow-sm hover:shadow-2xl hover:shadow-white/40 transition-shadow duration-300 rounded-lg w-80 p-4 "
      onClick={onClick}
      
    >
      <button className="cursor-pointer font-bold text-xl absolute right-2 top-1 text-white"
      onClick={(e) => {
        e.stopPropagation(); // Prevent click event from propagating to the parent
        alert('Deletion happening');
        deletion;
      }}>
      &times;
      </button>

      <div className="text-darkblue  font-bold text-2xl mb-2">{title}</div>
      <div className="text-darkblue font-bold text-2xl mb-2">{price},-</div>
      <span className="text-beige text-base mt-4 mb-4 text-2xl">
        <i>Høyeste budgiver: </i>
        {name}
      </span>
      <hr />
      <p className="text-white text-base mt-4 mb-4 text-2xl">{description}</p>
    </div>
  );
};

export default AuctionItem;
