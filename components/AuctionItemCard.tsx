"use client";

import React, { useState } from "react";
import Modal from "react-modal";

interface AuctionItemCardProps {
  title: string;
  highestBid: number;
  minIncrease: number;
  description: string;
  image: string; // Add image prop
}

const AuctionItemCard: React.FC<AuctionItemCardProps> = ({
  title,
  highestBid,
  minIncrease,
  description,
  image,
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({ amount: "", nameOfBidder: "" });

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: Math.random().toString(36).substr(2, 9), // Generate a random id
        amount: parseFloat(formData.amount),
        nameOfBidder: formData.nameOfBidder,
      }),
    });

    if (response.ok) {
      alert("Bid submitted successfully!");
    } else {
      alert("Failed to submit bid.");
    }
    closeModal();
  };

  const modalStyles: Modal.Styles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      background: "#004f58",
      border: "none",
      padding: "20px",
      borderRadius: "10px",
    },
    overlay: {
      backgroundColor: "rgba(64, 77, 97, 0.5)",
    },
  };

  return (
    <div className="flex">
      <div
        className="bg-containerBlue rounded-xl overflow-hidden shadow-lg m-8 text-left px-0 py-0 cursor-pointer hover:bg-regalblue"
        onClick={openModal}
        style={{
          width: "24rem",
        }}
      >
        <img src={image} alt={title} className="w-full h-52 object-cover bg-transparent/40" />
        <div className="px-6 py-4">
          <div className="text-darkblue font-bold text-2xl mb-2">{title}</div>
          <div className="flex flex-col justify-between w-128 rounded-md px-3 py-2 bg-transparent/20">
            <div className="flex text-xl">
              <span className="flex-1">Høyeste bud:</span>
              <span className="flex-1">Minste økning:</span>
            </div>
            <div className="flex text-3xl">
              <span className="flex-1 font-bold">{highestBid},-</span>
              <span className="flex-1">{minIncrease},-</span>
            </div>
          </div>

          <p className="text-black mt-4 mb-4 text-xl">{description}</p>
        </div>
        
      </div>

      <Modal isOpen={modalOpen} onRequestClose={closeModal} style={modalStyles} ariaHideApp={false}>
        <form onSubmit={handleSubmit}>
          <div className="text-2xl text-white font-bold italic mb-4">
            By på {title}
          </div>
          <div className="mb-4">
            <label className="block text-white text-lg font-bold mb-2" htmlFor="amount">
              Bid Amount:
            </label>
            <input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-lg font-bold mb-2" htmlFor="nameOfBidder">
              Name of Bidder:
            </label>
            <input
              id="nameOfBidder"
              type="text"
              value={formData.nameOfBidder}
              onChange={(e) => setFormData({ ...formData, nameOfBidder: e.target.value })}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={closeModal}
            >
              Avbryt
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Send bud
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AuctionItemCard;