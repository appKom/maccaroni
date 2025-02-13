"use client";

import React, { useState } from "react";
import Modal from "react-modal";

const AuctionItemCard = () => {
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
    <div>
      <div
        className="bg-containerBlue rounded overflow-hidden shadow-lg m-2 text-center px-4 py-2 cursor-pointer hover:bg-regalblue"
        onClick={openModal}
        style={{
          width: "20rem",
        }}
      >
        <div className="text-darkblue font-bold text-2xl mb-2">Auction Item</div>
        <div className="text-darkblue font-bold text-2xl mb-2">100,-</div>
        <span className="text-beige text-base mt-4 mb-4 text-2xl">
          <i>Høyeste budgiver: </i>John Doe
        </span>
        <hr />
        <p className="text-black text-base mt-4 mb-4 text-2xl">Description</p>
      </div>

      <Modal isOpen={modalOpen} onRequestClose={closeModal} style={modalStyles} ariaHideApp={false}>
        <form onSubmit={handleSubmit}>
          <div className="text-2xl text-white font-bold italic mb-4">
            By på Auction Item
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