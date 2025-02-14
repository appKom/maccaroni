"use client";

import React, { useState, FormEvent } from "react";
import Modal from "react-modal";
import AuctionItem from "./AuctionItem";

interface Item {
  title: string;
  description: string;
  price: number;
  highestBid: string;
  _id: string;
}

interface Props {
  items: { [key: number]: Item };
}

interface FormError {
  name?: string;
  amount?: string;
}

interface FormData {
  name?: string;
  email?: string;
  amount?: number;
  error?: FormError;
}

const AuctionItems: React.FC<Props> = ({ items }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [success, setSuccess] = useState<string>("");

  const closeModal = () => setModalOpen(false);

  const openModal = (item: Item) => {
    setActiveItem(item);
    setModalOpen(true);
  };

  const clearError = () => {
    setFormData((prev) => ({ ...prev, error: undefined }));
  };

  const validate = (currentFormData: FormData) => {
    if (!activeItem) return false; // safety check

    clearError();

    if ((currentFormData.amount ?? 0) <= activeItem.price * 1.05) {
      setFormData((prev) => ({
        ...prev,
        error: {
          ...prev.error,
          amount: `Budet ditt kan ikke være mindre enn ${
            activeItem.price * 1.05
          },- kr!`,
        },
      }));
      return false;
    }

    if (!currentFormData.name || currentFormData.name.length < 3) {
      setFormData((prev) => ({
        ...prev,
        error: {
          ...prev.error,
          name: "Navnet må være lenger enn to bokstaver",
        },
      }));
      return false;
    }

    return true;
  };

  const bid = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activeItem) return;

    const isValid = validate(formData);
    if (isValid) {
      try {
        const res = await fetch("/api/bid", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            item: activeItem._id,
            description: activeItem.description,
          }),
        });

        if (res.status === 200) {
          setSuccess(
            `Ditt bud på ${formData.amount} til ${activeItem.description} ble registrert! Du bør kunne se budet straks! Dersom dette ble gjort ved en feil, vennligst ta kontakt med Arrkom!`
          );
        } else {
          setSuccess(
            `Budet ditt gikk ikke gjennom :(\n FeilKode: ${res.statusText}`
          );
        }
      } catch (error) {
        console.error(error);
        setSuccess(
          "En feil oppsto ved innsending av budet ditt. Vennligst prøv igjen."
        );
      }
      setActiveItem(null);
      clearError();
    }
  };

  const modalStyles: Modal.Styles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      background: "none",
      border: "none",
    },
    overlay: {
      backgroundColor: "rgba(100,100,100, 0.5)",
    },
  };

  return (
    <div>
      <div className="text-4xl text-center p-5">
        Trykk på et auksjonsobjekt for å by!
      </div>
      <div className="text-2xl text-center">
        Nye bud må øke nåværende bud med 5% for å være gyldige. Ingen bud før
        22.04.2023 klokken 18:00 regnes som gjeldende.
      </div>
      <div className="flex flex-row flex-wrap justify-evenly pt-10 mx-20">
        {Object.keys(items).map((key) => {
          const itemKey = Number(key);
          const item = items[itemKey];
          return (
            <AuctionItem
              key={key}
              description={item.description}
              onClick={() => openModal(item)}
              price={item.price}
              name={item.highestBid}
              title={item.title}
              deletion={()=> openModal(item)}
            />
          );
        })}
        <button className="text-white font-bold w-40 h-40 rounded-full bg-gradient-to-r from-[#f093fb] to-[#f5576c] text-7xl shadow-sm hover:shadow-2xl hover:shadow-white/40 transition-shadow duration-300" onClick={() => alert('Clicked')}>+</button>
        <Modal
          isOpen={modalOpen}
          shouldCloseOnOverlayClick
          onRequestClose={closeModal}
          style={modalStyles}
          onAfterOpen={activeItem ? undefined : closeModal}
        >
          <div className="w-full max-w-xs bg-gray-800 rounded">
            {activeItem ? (
              <form
                className="bg-gradient-to-r from-[#f093fb] to-[#f5576c] shadow-md rounded px-8 pt-6 pb-8 mb-4"
                onSubmit={bid}
              >
                <div className="text-2xl">By på</div>
                <div className="text-2xl text-white font-bold italic">
                  {activeItem.title}
                </div>
                <p>Nåværende bud: {activeItem.price},-</p>
                <div className="mb-4">
                  <label
                    className="block text-white text-lg font-bold mb-2"
                    htmlFor="name"
                  >
                    Navn
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Ola Nordmann"
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight 
                               focus:outline-none focus:shadow-outline"
                  />
                  {formData.error?.name && (
                    <div
                      className="flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3 mt-2"
                      role="alert"
                    >
                      <svg
                        className="fill-current w-4 h-4 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
                      </svg>
                      <p>{formData.error.name}</p>
                    </div>
                  )}
                </div>
                <div className="mb-6">
                  <label
                    className="block text-white text-lg font-bold mb-2"
                    htmlFor="email"
                  >
                    E-post
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    placeholder="ola@nordmann.no"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight 
                               focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-6">
                  <label
                    className="block text-white text-lg font-bold mb-2"
                    htmlFor="amount"
                  >
                    Pris
                  </label>
                  <input
                    id="amount"
                    type="number"
                    placeholder={(activeItem.price * 1.05).toFixed(2)}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        amount: parseFloat(e.target.value),
                      }))
                    }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 
                               leading-tight focus:outline-none focus:shadow-outline"
                  />
                  {formData.error?.amount && (
                    <div
                      className="flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3"
                      role="alert"
                    >
                      <svg
                        className="fill-current w-4 h-4 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
                      </svg>
                      <p>{formData.error.amount}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded 
                               focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={closeModal}
                  >
                    Avbryt
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded 
                               focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    Send bud
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col justify-evenly items-center text-center w-full max-w-xs bg-gray-600 p-4 shadow-md">
                <p className="mb-4 text-xl text-white font-bold italic">
                  {success}
                </p>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded 
                             focus:outline-none focus:shadow-outline"
                  onClick={closeModal}
                  type="button"
                >
                  Lukk
                </button>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AuctionItems;
