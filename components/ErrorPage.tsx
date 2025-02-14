"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface ErrorPageProps {
  code: string | number;
  title: string;
  description: string;
}

export default function ErrorPage({
  code,
  title,
  description,
}: ErrorPageProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center  bg-inherit">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <h1 className="mb-4 text-6xl font-bold text-red-500">{code}</h1>
        <h2 className="mb-4 text-4xl font-semibold">{title}</h2>
        <p className="mb-8 text-lg text-gray-400">{description}</p>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-800"
        >
          <ArrowLeft className="mr-2 h-5 w-5 transition-transform duration-200 hover:-translate-x-1" />
          Gå tilbake
        </button>
      </div>
    </div>
  );
}
