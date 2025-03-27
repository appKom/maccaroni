"use client";

import { useState, useEffect, useRef } from "react";
import { UserPlus, XIcon, Edit, Upload, Trash2Icon } from "lucide-react";
import toast from "react-hot-toast";
import Table from "@/components/form/Table";
import { Competition } from "@prisma/client";
import TextInput from "@/components/form/TextInput";
import "react-quill-new/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { quillFormats, quillModules } from "@/components/markdown/Quill";
import DateInput from "@/components/form/DateInput";
import Image from "next/image";

const QuillEditor = dynamic(() => import("react-quill-new"), { ssr: false });

const AdminPrizeGoalsPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [time, setTime] = useState<Date | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingCompetition, setEditingCompetition] =
    useState<Competition | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [competition, setCompetition] = useState<Competition[]>([]);

  const fetchPrizeGoals = async () => {
    try {
      const response = await fetch("/api/competition");
      const data = await response.json();
      if (data) {
        setCompetition(data);
      }
      setIsLoading(false);
    } catch (error) {
      toast.error("Kunne ikke hente Konkuranseer" + error);
    }
  };

  useEffect(() => {
    fetchPrizeGoals();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImage(null);
    setImagePreview(null);
    setTime(undefined);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCompetition) {
      await updateCompetition();
    } else {
      await createPrizeGoal();
    }
  };

  const createPrizeGoal = async () => {
    if (!title || !description || !time) {
      toast.error("Fyll ut alle feltene");
      return;
    }

    try {
      const response = await fetch("/api/admin/competition", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          time,
          image: imagePreview,
        }),
      });
      if (response.ok) {
        toast.success("Konkuranse opprettet");
        resetForm();
        fetchPrizeGoals();
      } else {
        const errorData = await response.json();
        toast.error(
          `Kunne ikke opprette konkuranse: ${errorData.error || "Ukjent feil"}`
        );
      }
    } catch (error) {
      toast.error("Kunne ikke opprette konkuranse" + error);
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

  const updateCompetition = async () => {
    if (!editingCompetition) return;

    try {
      let imageData = editingCompetition.image;

      if (image && imagePreview && imagePreview !== editingCompetition.image) {
        imageData = imagePreview;
      }

      const response = await fetch(`/api/admin/competition`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingCompetition.id,
          title,
          description,
          time,
          image: imageData,
        }),
      });
      if (response.ok) {
        toast.success("Konkuranse oppdatert");
        resetForm();
        setEditingCompetition(null);
        fetchPrizeGoals();
      } else {
        const errorData = await response.json();
        toast.error(
          `Kunne ikke oppdatere konkuranse: ${errorData.error || "Ukjent feil"}`
        );
      }
    } catch (error) {
      toast.error("Kunne ikke oppdatere konkuranse" + error);
    }
  };

  const handleEdit = (competition: Competition) => {
    setEditingCompetition(competition);
    setTitle(competition.title);
    setDescription(competition.description);
    setTime(competition.time);

    if (competition.image) {
      setImagePreview(competition.image);
    }
  };

  const handleRemove = async (id: string) => {
    const confirmDelete = window.confirm(
      "Er du sikker på at du vil slette konkuranseen?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch("/api/admin/competition", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        toast.success("Konkuranse slettet");
        fetchPrizeGoals();
      } else {
        const errorData = await response.json();
        toast.error(
          `Kunne ikke slette konkuranse: ${errorData.error || "Ukjent feil"}`
        );
      }
    } catch (error) {
      toast.error("Kunne ikke slette konkuranse" + error);
    }
  };

  const columns = [
    {
      header: "Tittel",
      accessor: "title" as keyof Competition,
    },
    {
      header: "Beskrivelse",
      accessor: "description" as keyof Competition,
      renderCell: (competition: Competition) => (
        <div
          className="max-w-xs truncate"
          dangerouslySetInnerHTML={{ __html: competition.description }}
        />
      ),
    },
    {
      header: "Tid",
      accessor: "time" as keyof Competition,
      renderCell: (competition: Competition) => (
        <span>
          {new Date(competition.time).toLocaleTimeString("no-NO", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      header: "Bilde",
      accessor: "image" as keyof Competition,
      renderCell: (competition: Competition) => (
        <Image
          height={50}
          width={50}
          src={competition.image ?? "/Online_hvit_o.svg"}
          alt={competition.title}
          className="w-10 h-10 rounded-full object-cover"
        />
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4 w-full items-start">
      <h1 className="text-3xl font-bold mb-4">Administrer Konkuranser</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <TextInput
          id="title"
          label="Tittel"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
          required
        />
        <DateInput
          value={time}
          onChange={(e) => setTime(new Date(e.target.value))}
          label="Tid"
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

                if (editingCompetition) {
                  setEditingCompetition({
                    ...editingCompetition,
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

        <div className="flex flex-col gap-4 mt-8 mb-16 pb-16">
          <QuillEditor
            value={description}
            modules={quillModules}
            formats={quillFormats}
            theme="snow"
            placeholder="Skriv beskrivelsen her..."
            className="w-full h-[40vh] "
            onChange={(content) => setDescription(content)}
          />
        </div>

        <button
          type="submit"
          className="inline-flex items-center px-4 mt-16 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {editingCompetition ? (
            <>
              <Edit className="mr-2 h-4 w-4" />
              Oppdater Konkuranse
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Legg til Konkuranse
            </>
          )}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Konkuranse</h2>
      {isLoading ? (
        <div className=" text-white flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-y-2 border-onlineyellow mb-4"></div>
            <h2 className="text-2xl font-semibold">
              Laster inn Konkuranseer...
            </h2>
          </div>
        </div>
      ) : competition ? (
        <Table
          columns={columns}
          data={competition}
          renderRowActions={(prizeGoal: Competition) => (
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
      ) : null}
    </div>
  );
};

export default AdminPrizeGoalsPage;
