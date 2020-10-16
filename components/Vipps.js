import animations from "../styles/animations.module.css";

const Vipp = (props) => {
  console.log(animations.wiggle);
  return (
    <div
      className={`flex items-center overflow-hidden m-3 rounded-tl-lg rounded-tr-lg rounded-br-lg ${animations.wiggle}`}
      style={{ background: "#ff5b24" }}
    >
      <img
        src="https://lh3.googleusercontent.com/0PbbTOfd4p_kT2iumjByeiQoj4AkK5aHFFeAe61BeW9saYtpY0z4S0CPBjJUN188fpg"
        width="50px"
      />
      <span className="flex justify-between w-full">
        <span className="p-2">{props.name} donerte</span>
        <span className="p-2 font-bold">{props.amount}kr!!</span>
      </span>
    </div>
  );
};

const TopVipp = ({ vipp }) => {
  return (
    <div>
      <h5>Største donasjon:</h5>
      <Vipp name={vipp.name} amount={item.amount} />
    </div>
  );
};

const Vipps = (props) => {
  const vipps = props.items
    .slice(0, 6)
    .map((item) => <Vipp name={item.name} amount={item.amount} />);

  return (
    <div class="flex flex-col">
      <TopVipp vipp={props.topDonor} />
      {vipps}
    </div>
  );
};

export default Vipps;
