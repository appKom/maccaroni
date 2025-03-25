"use client";

import { useState } from "react";

export default function DonatePage() {
  const [amount, setAmount] = useState<number>(100);
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setAmount(isNaN(value) ? 0 : value);
  };

  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobileNumber(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Convert amount to minor units (øre)
      const amountInMinorUnits = amount * 100;

      const response = await fetch("/api/vipps/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountInMinorUnits,
          mobileNumber,
          transactionText: `Donation of ${amount} NOK`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to initiate payment");
      }

      const data = await response.json();

      // Redirect to Vipps payment page
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        throw new Error("No redirect URL received");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto container px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Donate to Charity Event</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Donation Amount (NOK)
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={handleAmountChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="mobileNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mobile Number (optional)
              </label>
              <input
                type="tel"
                id="mobileNumber"
                value={mobileNumber}
                onChange={handleMobileNumberChange}
                placeholder="+47 XXXXXXXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Your mobile number will be used for Vipps payment.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button
                type="submit"
                disabled={isLoading || amount <= 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? "Processing..."
                  : `Donate ${amount} NOK with Vipps`}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Your donation helps support our charity event. Thank you for your
          generosity!
        </p>
      </div>
    </main>
  );
}
