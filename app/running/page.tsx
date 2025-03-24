"use client";

import Paragraph from "@/components/Paragraph";
import CoverImage from "@/components/CoverImage";

const RunningPage = () => {


  return (
    <div className="mx-auto py-8">
      <CoverImage image="/temporary-cover1.jpg" alt="Temporary cover 1" />

      <section className="text-start my-8">
        <Paragraph
          header="Hvordan løper vi?"
          text="Vi ønsker å samle flest mulig onlinere som vil løpe for å samle inn penger til barnekreftforeningen."
        />
      </section>
    </div>
  );
};

export default RunningPage;
