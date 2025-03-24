"use client";

import { useState, useEffect, useRef } from "react";
import { UserPlus, XIcon, Edit, Trash2Icon, Upload } from "lucide-react";
import toast from "react-hot-toast";
import Table from "@/components/form/Table";
import TextInput from "@/components/form/TextInput";
import NumberInput from "@/components/form/NumberInput";
import TextAreaInput from "@/components/form/TextAreaInput";
import { Auction } from "@prisma/client";
import Image from "next/image";

const AdminAuctionPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [minimumIncrease, setMinimumIncrease] = useState(0);
  const [startPrice, setStartPrice] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingAuction, setEditingAuction] = useState<Auction | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [auctions, setAuctions] = useState<Auction[]>([]);

  const fetchAuctions = async () => {
    try {
      const response = await fetch("/api/auctions");
      const data = await response.json();
      setAuctions(data);
      setIsLoading(false);
    } catch (error) {
      toast.error("Kunne ikke hente auksjoner" + error);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const resetForm = () => {
    setName("");
    setDescription("");
    setMinimumIncrease(0);
    setStartPrice(0);
    setImage(null);
    setImagePreview(null);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAuction) {
      await updateAuction();
    } else {
      await createAuction();
    }
  };

  const createAuction = async () => {
    if (!name || !description || !minimumIncrease || !startPrice) {
      toast.error("Fyll ut alle feltene");
      return;
    }

    try {
      const response = await fetch("/api/admin/auctions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          minimumIncrease,
          startPrice,
          image: imagePreview,
        }),
      });
      if (response.ok) {
        toast.success("Auksjon opprettet");
        resetForm();
        fetchAuctions();
      } else {
        toast.error("Kunne ikke opprette auksjon");
      }
    } catch (error) {
      toast.error("Kunne ikke opprette auksjon" + error);
    }
  };

  const updateAuction = async () => {
    if (!editingAuction) return;

    try {
      let imageData = editingAuction.image;

      if (image && imagePreview && imagePreview !== editingAuction.image) {
        imageData = imagePreview;
      }
      const response = await fetch(`/api/admin/auctions`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingAuction?.id,
          name,
          description,
          minimumIncrease,
          startPrice,
          image: imageData,
        }),
      });
      if (response.ok) {
        toast.success("Auksjon oppdatert");
        resetForm();
        fetchAuctions();
      } else {
        toast.error("Kunne ikke oppdatere auksjon");
      }
    } catch (error) {
      toast.error("Kunne ikke oppdatere auksjon" + error);
    }
  };

  const handleEdit = (auction: Auction) => {
    setName(auction.name);
    setDescription(auction.description);
    setMinimumIncrease(auction.minimumIncrease);
    setStartPrice(auction.startPrice);
    setEditingAuction(auction);

    if (auction.image) {
      setImagePreview(auction.image);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = async (id: string) => {
    const confirmDelete = window.confirm(
      "Er du sikker på at du vil slette auksjonen?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch("/api/admin/auctions", {
        method: "DELETE",
        body: JSON.stringify(id),
      });
      if (response.ok) {
        toast.success("Auksjon slettet");
        fetchAuctions();
      } else {
        toast.error("Kunne ikke slette auksjon");
      }
    } catch (error) {
      toast.error("Kunne ikke slette auksjon" + error);
    }
  };

  const columns = [
    {
      header: "Navn",
      accessor: "name" as keyof Auction,
    },
    {
      header: "Beskrivelse",
      accessor: "description" as keyof Auction,
    },
    {
      header: "Minimum budøkning",
      accessor: "minimumIncrease" as keyof Auction,
    },
    {
      header: "Startpris",
      accessor: "startPrice" as keyof Auction,
    },
    {
      header: "Bilde",
      accessor: "image" as keyof Auction,
      renderCell: (auction: Auction) => (
        <Image
          height={50}
          width={50}
          src={auction.image ?? "/Online_hvit_o.svg"}
          alt={auction.name}
          className="w-10 h-10 rounded-full object-cover"
        />
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4 w-full items-start">
      <h1 className="text-3xl font-bold mb-4">Administrer auksjonsvarer</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <TextInput
          id="name"
          label="Navn"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
          required
        />

        <TextAreaInput
          id="description"
          label="Beskrivelse"
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setDescription(e.target.value)
          }
          required
        />

        <div className="flex items-center gap-4 mt-4">
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => {
              if (imagePreview) {
                setImage(null);
                setImagePreview(null);

                if (editingAuction) {
                  setEditingAuction({
                    ...editingAuction,
                    image: null,
                  });
                }
              } else {
                fileInputRef.current?.click();
              }
            }}
            className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
              imagePreview
                ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
            }  focus:outline-none focus:ring-2 focus:ring-offset-2 `}
          >
            {imagePreview ? (
              <Trash2Icon className="inline-block mr-2 h-4 w-4" />
            ) : (
              <Upload className="inline-block mr-2 h-4 w-4" />
            )}

            {imagePreview ? "Slett bilde" : "Last opp bilde"}
          </button>

          {imagePreview && (
            <Image
              src={imagePreview || "/placeholder.svg"}
              alt="Preview"
              height={40}
              width={40}
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
        </div>

        <NumberInput
          id="minimumIncrease"
          label="Minimum budøkning"
          value={minimumIncrease}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setMinimumIncrease(parseInt(e.target.value))
          }
          required
        />
        <NumberInput
          id="startPrice"
          label="Startpris"
          value={startPrice}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setStartPrice(parseInt(e.target.value))
          }
          required
        />

        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {editingAuction ? (
            <>
              <Edit className="mr-2 h-4 w-4" />
              Oppdater auksjon
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Legg til auksjon
            </>
          )}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Auksjonsliste</h2>
      {isLoading ? (
        <div className=" text-white flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-y-2 border-onlineyellow mb-4"></div>
            <h2 className="text-2xl font-semibold">Laster inn auksjoner...</h2>
          </div>
        </div>
      ) : (
        <Table
          columns={columns}
          data={auctions}
          renderRowActions={(auction: Auction) => (
            <>
              <button
                onClick={() => handleEdit(auction)}
                className="text-blue-500 hover:text-blue-700 mr-2"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleRemove(auction.id)}
                className="text-red-500 hover:text-red-700"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </>
          )}
        />
      )}
    </div>
  );
};

export default AdminAuctionPage;
