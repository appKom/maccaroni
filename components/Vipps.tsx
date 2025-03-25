import React from "react";
import animations from "./animations.module.css";
import QRCode from "../components/QRCode";

interface VippProps {
  name: string;
  amount: number;
}

const Vipp: React.FC<VippProps> = ({ name, amount }) => {
  return (
    <div>
      <div
        className={`bg-regalblue flex items-center overflow-hidden m-3 rounded-tl-lg rounded-tr-lg rounded-br-lg shadow-md ${animations.wiggle}`}
        style={{ background: "#ff5b24" }}
      >
        <img
          src="https://i.imgur.com/RVgB3E6.png"
          width="50px"
          alt="Donation"
        />
        <span className="flex justify-between w-full">
          <span className="p-3">{name} donerte</span>
          <span className="p-3 font-bold">{amount}kr!!</span>
        </span>
      </div>
    </div>
  );
};

interface Donor {
  name: string;
  amount: number;
}

interface TopVippProps {
  vipp?: Donor;
}

const TopVipp: React.FC<TopVippProps> = ({ vipp }) => {
  return (
    <div>
      <div className="m-1 text-4xl mb-2 text-center">Største donasjon</div>
      {vipp && (
        <div
          className={`flex items-center overflow-hidden m-3 rounded-tl-lg rounded-tr-lg rounded-br-lg shadow-md ${animations.wiggle}`}
          style={{ background: "#39AC37" }}
        >
          <img
            src="https://i.imgur.com/RVgB3E6.png"
            width="50px"
            alt="Top donation"
          />
          <span className="flex justify-between w-full">
            <span className="p-3">{vipp.name} donerte</span>
            <span className="p-3 font-bold">{vipp.amount}kr!!</span>
          </span>
        </div>
      )}
    </div>
  );
};

interface VippsProps {
  items: Donor[];
  topDonor?: Donor;
}

const Vipps: React.FC<VippsProps> = ({ items, topDonor }) => {
  const vippsList = items.map((item, index) => (
    <Vipp key={index} name={item.name} amount={item.amount} />
  ));

  return (
    <div className="flex flex-col justify-center">
      <TopVipp vipp={topDonor} />
      <hr />
      <div className="m-1 text-4xl mb-2 text-center">Siste donasjoner</div>
      {vippsList}
      {/* <QRCode /> */}
    </div>
  );
};

export default Vipps;
