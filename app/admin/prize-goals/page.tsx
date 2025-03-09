"use client";

import { useState, useEffect } from "react";
import { UserPlus, XIcon, Edit } from "lucide-react";
import toast from "react-hot-toast";
import Table from "@/components/form/Table";
import NumberInput from "@/components/form/NumberInput";
import TextAreaInput from "@/components/form/TextAreaInput";

interface PrizeGoalType {
  id: string;
  goal: number;
  description: string;
}

const AdminPrizeGoalsPage = () => {
  const [goal, setGoal] = useState(0);
  const [description, setDescription] = useState("");

  const [editingPrizeGoal, setEditingPrizeGoal] =
    useState<PrizeGoalType | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [prizeGoals, setPrizeGoals] = useState<PrizeGoalType[]>([]);

  const fetchPrizeGoals = async () => {
    try {
      const response = await fetch("/api/prize-goals");
      const data = await response.json();
      setPrizeGoals(data);
      setIsLoading(false);
    } catch (error) {
      toast.error("Kunne ikke hente prismåler" + error);
    }
  };

  useEffect(() => {
    fetchPrizeGoals();
  }, []);

  const resetForm = () => {
    setGoal(0);
    setDescription("");
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPrizeGoal) {
      await updatePrizeGoal();
    } else {
      await createPrizeGoal();
    }
  };

  const createPrizeGoal = async () => {
    if (!goal || !description) {
      toast.error("Fyll ut alle feltene");
      return;
    }

    try {
      const response = await fetch("/api/admin/prize-goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goal,
          description,
        }),
      });
      if (response.ok) {
        toast.success("prismål opprettet");
        resetForm();
        fetchPrizeGoals();
      } else {
        toast.error("Kunne ikke opprette prismål");
      }
    } catch (error) {
      toast.error("Kunne ikke opprette prismål" + error);
    }
  };

  const updatePrizeGoal = async () => {
    try {
      const response = await fetch(`/api/admin/prize-goals`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingPrizeGoal?.id,
          goal,
          description,
        }),
      });
      if (response.ok) {
        toast.success("Prismål oppdatert");
        resetForm();
        fetchPrizeGoals();
      } else {
        toast.error("Kunne ikke oppdatere prismål");
      }
    } catch (error) {
      toast.error("Kunne ikke oppdatere prismål" + error);
    }
  };

  const handleEdit = (prizeGoal: PrizeGoalType) => {
    setEditingPrizeGoal(prizeGoal);
    setGoal(prizeGoal.goal);
    setDescription(prizeGoal.description);
  };

  const handleRemove = async (id: string) => {
    const confirmDelete = window.confirm(
      "Er du sikker på at du vil slette prismålen?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch("/api/admin/prize-goals", {
        method: "DELETE",
        body: JSON.stringify(id),
      });
      if (response.ok) {
        toast.success("Prismål slettet");
        fetchPrizeGoals();
      } else {
        toast.error("Kunne ikke slette prismål");
      }
    } catch (error) {
      toast.error("Kunne ikke slette prismål" + error);
    }
  };

  const columns = [
    {
      header: "Mål",
      accessor: "goal" as keyof PrizeGoalType,
    },
    {
      header: "Beskrivelse",
      accessor: "description" as keyof PrizeGoalType,
    },
  ];

  return (
    <div className="container mx-auto p-4 w-full items-start">
      <h1 className="text-3xl font-bold mb-4">Administrer Prismål</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <NumberInput
          id="name"
          label="Navn"
          value={goal}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setGoal(parseInt(e.target.value))
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

        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {editingPrizeGoal ? (
            <>
              <Edit className="mr-2 h-4 w-4" />
              Oppdater prismål
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Legg til prismål
            </>
          )}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Prismål</h2>
      {isLoading ? (
        <div className=" text-white flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-y-2 border-onlineyellow mb-4"></div>
            <h2 className="text-2xl font-semibold">Laster inn prismåler...</h2>
          </div>
        </div>
      ) : (
        <Table
          columns={columns}
          data={prizeGoals}
          renderRowActions={(prizeGoal: PrizeGoalType) => (
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

export default AdminPrizeGoalsPage;
