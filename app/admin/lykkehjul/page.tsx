"use client";
import Table from "@/components/form/Table";
import type { Collected } from "@prisma/client";
import { useState, useEffect, useRef } from "react";
import { fetchVippsCollections } from "./actions";
import { Textarea } from "@/components/ui/textarea";
import { Check, ClipboardCopy } from "lucide-react";
import { Button } from "@/components/Button";
import toast from "react-hot-toast";

export default function AdminLuckyWheelPage() {
  const [vippsCollections, setVippsCollections] = useState<Collected[]>([]);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  const getLoddAmount = (amount: number) => {
    if (amount < 20) {
      return 0;
    } else {
      return Math.floor(amount / 20);
    }
  };

  useEffect(() => {
    const getCollections = async () => {
      try {
        const result = await fetchVippsCollections();

        if ("error" in result) {
          setError(result.error as string);
        } else {
          setVippsCollections(result as Collected[]);
        }
      } catch (err) {
        setError("Failed to fetch collections");
        console.error(err);
      }
    };

    getCollections();
  }, []);

  const columns = [
    {
      header: "Navn på Budgiver",
      accessor: "nameOfBidder" as keyof Collected,
    },
    {
      header: "Beskrivelse",
      accessor: "description" as keyof Collected,
    },
    {
      header: "Beløp",
      accessor: "amount" as keyof Collected,
    },
    {
      header: "Antall lodd",
      accessor: "loddAmount" as keyof Collected,
      renderCell: (collected: Collected) => {
        return getLoddAmount(collected.amount);
      },
    },
  ];

  const generateNamesList = () => {
    let namesList = "";

    vippsCollections.forEach((collection) => {
      const loddAmount = getLoddAmount(collection.amount);
      const name = collection.nameOfBidder;

      // Add the name to the list loddAmount times
      for (let i = 0; i < loddAmount; i++) {
        namesList += name + "\n";
      }
    });

    return namesList;
  };

  const handleCopyToClipboard = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
      navigator.clipboard.writeText(textareaRef.current.value).catch((err) => {
        console.error("Failed to copy text: ", err);
      });

      toast.success("Kopierte navn til utklippstavle");

      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  if (error) {
    return (
      <main className="container mx-auto p-4 w-full items-start">
        <h1 className="text-3xl font-bold mb-4">Administrer Lykkehjul</h1>
        <div className="text-red-500">Error: {error}</div>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4 w-full items-start">
      <h1 className="text-3xl font-bold mb-4">Administrer Lykkehjul</h1>
      {vippsCollections.length > 0 ? (
        <div className="flex flex-col gap-6">
          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-2">
              Denne listen viser navn på budgivere gjentatt for antall lodd de
              har kjøpt.
            </p>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Textarea
                  ref={textareaRef}
                  className="font-mono h-64 text-white"
                  value={generateNamesList()}
                  readOnly
                />
              </div>

              <div className="flex flex-row justify-end">
                <Button
                  className="w-fit flex items-center gap-2 max-w-sm mt-4"
                  onClick={handleCopyToClipboard}
                  color="green"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Kopiert
                    </>
                  ) : (
                    <>
                      <ClipboardCopy className="h-4 w-4" />
                      Kopier til utklippstavle
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          <Table columns={columns} data={vippsCollections} />
        </div>
      ) : (
        <div className="text-white flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-y-2 border-onlineyellow mb-4"></div>
            <h2 className="text-2xl font-semibold">
              Laster inn Innsamlinger...
            </h2>
          </div>
        </div>
      )}
    </main>
  );
}
