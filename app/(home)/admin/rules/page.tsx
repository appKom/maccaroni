"use client";
import LoadingCircle from "@/components/admin/LoadingCircle";
import { quillFormats, quillModules } from "@/components/markdown/Quill";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "react-quill-new/dist/quill.snow.css";

const QuillEditor = dynamic(() => import("react-quill-new"), { ssr: false });

export default function AdminRulePage() {
  const [ruleSheet, setRuleSheet] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const submitRuleSheet = async ({ ruleSheet }: { ruleSheet: string }) => {
    const res = await fetch("/api/admin/rulesheet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ruleSheet }),
    });

    if (res.ok) {
      toast.success("Reglene ble sendt inn");
    } else {
      toast.error("Noe gikk galt, prøv igjen senere");
    }
  };

  useEffect(() => {
    const fetchRuleSheet = async () => {
      const res = await fetch("/api/rulesheet");
      const data = await res.json();

      if (res.ok) {
        setRuleSheet(data.description);
        setLoading(false);
      }
    };

    fetchRuleSheet();
  }, []);

  if (loading || !ruleSheet) {
    return <LoadingCircle />;
  }

  return (
    <div className="mx-auto container px-4">
      <main className="flex flex-col">
        <h1 className="text-3xl font-semibold">Rediger reglelarket</h1>

        <div className="flex flex-col gap-4 mt-8 mb-16">
          <QuillEditor
            value={ruleSheet}
            modules={quillModules}
            formats={quillFormats}
            theme="snow"
            placeholder="Skriv reglene her..."
            className="w-full h-[40vh] "
            onChange={(content) => setRuleSheet(content)}
          />
        </div>
        <button
          onClick={() => submitRuleSheet({ ruleSheet })}
          className="px-4 py-2 mt-8 border-onlineOrange border text-onlineOrange  rounded-lg hover:border-orange-600 hover:text-orange-600"
        >
          Send inn
        </button>
      </main>
    </div>
  );
}
