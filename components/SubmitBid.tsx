"use client";

import { useState } from "react";

export default function SubmitBid() {
  const [amount, setAmount] = useState("");
  const [nameOfBidder, setNameOfBidder] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: Math.random().toString(36).substr(2, 9), // Generate a random id
        amount: parseFloat(amount),
        nameOfBidder,
      }),
    });

    if (response.ok) {
      alert("Bid submitted successfully!");
    } else {
      alert("Failed to submit bid.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <br />
        <label>
          Name of Bidder:
          <input
            type="text"
            value={nameOfBidder}
            onChange={(e) => setNameOfBidder(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Submit Bid</button>
      </form>
    </div>
  );
}