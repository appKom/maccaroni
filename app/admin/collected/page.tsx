"use client";

import { useState, useEffect, useRef } from "react";
import { UserPlus, XIcon, Edit } from "lucide-react";
import toast from "react-hot-toast";
import Table from "@/components/form/Table";
import NumberInput from "@/components/form/NumberInput";
import TextAreaInput from "@/components/form/TextAreaInput";
import { Collected, CollectedType } from "@prisma/client";
import SelectInput from "@/components/form/SelectedInput";
import TextInput from "@/components/form/TextInput";
import Image from "next/image";

const AdminCollectedPage = () => {
  const [amount, setAmount] = useState(0);
  const [nameOfBidder, setNameOfBidder] = useState("");
  const [emailOfBidder, setEmailOfBidder] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [type, setType] = useState<CollectedType>(CollectedType.LIVE_AUCTION);

  const [editingPrizeGoal, setEditingPrizeGoal] = useState<Collected | null>(
    null
  );

  const [isLoading, setIsLoading] = useState(true);

  const [collected, setCollected] = useState<Collected[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPrizeGoals = async () => {
    try {
      const response = await fetch("/api/collected");
      const data = await response.json();
      setCollected(data);
      setIsLoading(false);
    } catch (error) {
      toast.error("Kunne ikke hente innsamlinger" + error);
    }
  };

  useEffect(() => {
    fetchPrizeGoals();
  }, []);

  const resetForm = () => {
    setAmount(0);
    setDescription("");
    setEmailOfBidder("");
    setNameOfBidder("");
    setEditingPrizeGoal(null);
    setType(CollectedType.LIVE_AUCTION);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPrizeGoal) {
      await updateCollected();
    } else {
      await createPrizeGoal();
    }
  };

  const createPrizeGoal = async () => {
    if (!amount) {
      toast.error("Fyll ut alle feltene");
      return;
    }

    try {
      const response = await fetch("/api/admin/collected", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          nameOfBidder,
          emailOfBidder,
          description,
          type,
        }),
      });
      if (response.ok) {
        toast.success("Innsamling opprettet");
        resetForm();
        fetchPrizeGoals();
      } else {
        toast.error("Kunne ikke opprette Innsamling");
      }
    } catch (error) {
      toast.error("Kunne ikke opprette Innsamling" + error);
    }
  };

  const updateCollected = async () => {
    try {
      const response = await fetch(`/api/admin/collected`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingPrizeGoal?.id,
          amount,
          nameOfBidder,
          emailOfBidder,
          description,
          type,
        }),
      });
      if (response.ok) {
        toast.success("Innsamling oppdatert");
        resetForm();
        fetchPrizeGoals();
      } else {
        toast.error("Kunne ikke oppdatere Innsamling");
      }
    } catch (error) {
      toast.error("Kunne ikke oppdatere Innsamling" + error);
    }
  };

  const handleEdit = (collected: Collected) => {
    setEditingPrizeGoal(collected);
    setAmount(collected.amount);
    setNameOfBidder(collected.nameOfBidder);
    setEmailOfBidder(collected.emailOfBidder);
    if (collected.description) {
      setDescription(collected.description);
    }

    setType(collected.type);
  };

  const handleRemove = async (id: string) => {
    const confirmDelete = window.confirm(
      "Er du sikker på at du vil slette Innsamlingen?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch("/api/admin/collected", {
        method: "DELETE",
        body: JSON.stringify(id),
      });
      if (response.ok) {
        toast.success("Innsamling slettet");
        fetchPrizeGoals();
      } else {
        toast.error("Kunne ikke slette Innsamling");
      }
    } catch (error) {
      toast.error("Kunne ikke slette Innsamling" + error);
    }
  };

  const handleVippsUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const formData = new FormData();
      formData.append("pdf", file);

      try {
        const response = await fetch("/api/admin/vipps", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to process PDF");
        } else {
          toast.success("Vipps PDF lastet opp");
        }

        console.log(data);
      } catch (err) {
        toast.error("Oops det skjedde en feil" + err);
      }
    }
  };

  const columns = [
    {
      header: "Mengde",
      accessor: "amount" as keyof Collected,
    },
    {
      header: "Navn på Budgiver",
      accessor: "nameOfBidder" as keyof Collected,
    },
    {
      header: "Epost på Budgiver",
      accessor: "emailOfBidder" as keyof Collected,
      renderCell: (collected: Collected) => {
        switch (collected.emailOfBidder) {
          case undefined:
            return "";
          default:
            return collected.emailOfBidder;
        }
      },
    },
    {
      header: "Beskrivelse",
      accessor: "description" as keyof Collected,
    },
    {
      header: "Type",
      accessor: "type" as keyof Collected,
      renderCell: (collected: Collected) => {
        switch (collected.type) {
          case CollectedType.SILENT_AUCTION:
            return "Stille Auksjon";
          case CollectedType.LIVE_AUCTION:
            return "Fysisk Auksjon";
          case CollectedType.VIPPS:
            return "Vipps";
          default:
            return collected.type;
        }
      },
    },
  ];

  return (
    <div className="container mx-auto p-4 w-full items-start">
      <h1 className="text-3xl font-bold mb-4">Administrer Innsamling</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <NumberInput
          id="name"
          label="Pris"
          value={amount}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAmount(parseInt(e.target.value))
          }
          required
        />

        <TextInput
          id="nameOfBidder"
          label="Navn på Budgiver"
          value={nameOfBidder}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNameOfBidder(e.target.value)
          }
          required
        />
        <TextInput
          id="emailOfBidder"
          label="Epost til Budgiver"
          value={emailOfBidder ?? ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmailOfBidder(e.target.value)
          }
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

        <SelectInput
          label="Type"
          defaultValue={editingPrizeGoal ? editingPrizeGoal.type : ""}
          value={type}
          updateInputValues={(value: string) => setType(value as CollectedType)}
          options={[
            { label: "Live Auksjon", value: CollectedType.LIVE_AUCTION },
            { label: "Stille Auksjon", value: CollectedType.SILENT_AUCTION },
            { label: "Vipps", value: CollectedType.VIPPS },
          ]}
        />
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {editingPrizeGoal ? (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Oppdater Innsamling
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Legg til Innsamling
              </>
            )}
          </button>

          <input
            type="file"
            onChange={handleVippsUpload}
            ref={fileInputRef}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <Image
              className="mr-2 h-8 w-8"
              src="/vipps.svg"
              alt="Vipps"
              width={20}
              height={20}
            />
            Last opp Vipps PDF
          </button>
        </div>
      </form>

      <h2 className="text-xl font-semibold mb-2">Innsamling</h2>
      {isLoading ? (
        <div className=" text-white flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-y-2 border-onlineyellow mb-4"></div>
            <h2 className="text-2xl font-semibold">
              Laster inn Innsamlinger...
            </h2>
          </div>
        </div>
      ) : (
        <Table
          columns={columns}
          data={collected}
          renderRowActions={(prizeGoal: Collected) => (
            <>
              <button
                onClick={() => handleEdit(prizeGoal)}
                className="text-blue-500 hover:text-blue-700 mr-2"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleRemove(prizeGoal.id)}
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

export default AdminCollectedPage;
