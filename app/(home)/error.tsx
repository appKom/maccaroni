"use client";

import ErrorPage from "@/components/ErrorPage";

export default function Error() {
  return (
    <ErrorPage
      code={500}
      title="Intern serverfeil"
      description="Vi beklager, men noe gikk galt på vår side. Vennligst prøv igjen senere."
    />
  );
}
