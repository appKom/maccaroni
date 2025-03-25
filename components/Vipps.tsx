import React from "react";
import animations from "./animations.module.css";
import QRCode from "../components/QRCode";
import { Collected } from "@prisma/client";

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

interface TopVippProps {
  name: string;
  amount: number;
}

const TopVipp = ({ name, amount }: TopVippProps) => {
  return (
    <div>
      <h3 className="text-3xl font-semibold mb-6 text-purple-100">
        Største donasjon
      </h3>
      {name && amount && (
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
            <span className="p-3">{name} donerte</span>
            <span className="p-3 font-bold">{amount}kr!!</span>
          </span>
        </div>
      )}
    </div>
  );
};

interface VippsProps {
  collected: Collected[];
  topDonor: Collected | null;
}

const Vipps = ({ collected, topDonor }: VippsProps) => {
  return (
    <div className="flex flex-col ">
      {topDonor && (
        <TopVipp name={topDonor.nameOfBidder} amount={topDonor.amount} />
      )}
      <QRCode />
      <h3 className="text-3xl font-semibold mb-6 text-purple-100">
        Siste donasjoner
      </h3>

      {collected &&
        collected.map((item) => (
          <Vipp key={item.id} name={item.nameOfBidder} amount={item.amount} />
        ))}
    </div>
  );
};

export default Vipps;
