import Paragraph from "@/components/Paragraph";
import CoverImage from "@/components/CoverImage";
import Link from "next/link";
import { Button } from "@/components/Button";

const RunningPage = () => {
  return (
    <div className="mx-auto pb-8 max-w-3xl px-4">
      <CoverImage image="/temporary-cover1.jpg" alt="Running for Charity" />

      <section className="text-center my-8 mb-16">
        <Paragraph
          header="Online Løpeuke"
          text="Online Løpeuke er en innsamlingsaksjon der vi kombinerer fysisk aktivitet med veldedighet. I løpet av én uke samler vi onlinere til å løpe så mange kilometer som mulig, og hver deltaker donerer et selvvalgt beløp per kilometer til Mental Helse. Bli med og løp for en god sak – både for din egen og andres mentale helse!"
        />
      </section>

      <section className="text-start my-8 space-y-4 mb-16">
        <h2 className="text-2xl font-bold text-white">
          1. Bli med i Strava-klubben
        </h2>
        <p>
          For å delta må du bli med i vår Strava-klubb. All løping i løpet av
          uka blir automatisk registrert der.
        </p>
        <div className="text-center">
          <Button
            href="https://www.strava.com/clubs/1407539"
            className="mt-4 max-w-sm"
            color="green"
          >
            Bli med i Strava-klubben
          </Button>
        </div>
      </section>

      <section className="text-start my-8 space-y-4 mb-16">
        <h2 className="text-2xl font-bold text-white">
          2. Skriv inn din pledge
        </h2>
        <p>
          Du bestemmer selv hvor mye du ønsker å donere per kilometer du løper.
          F.eks. 5 kr/km.
        </p>
        <p>
          Skriv inn din pledge i Google-skjemaet nedenfor. Etter løpeuka
          summerer vi distansen din og du donerer beløpet direkte til Mental
          Helse.
        </p>
        <div className="text-center">
          <Button
            href="https://docs.google.com/spreadsheets/d/1pDpJnNFOmXgXWLo3bu8fmS4zzkUxhHLOz3PHLzFGBXM/edit?usp=sharing"
            color="blue"
            className="mt-4 max-w-sm"
          >
            Skriv inn din pledge
          </Button>
        </div>
      </section>

      <section className="text-start my-8 space-y-4 mb-16">
        <h2 className="text-2xl font-bold text-white">3. Løp så mye du vil!</h2>
        <p>
          Hele løpeuka teller – hver kilometer du logger på Strava bidrar til en
          større donasjon. Del gjerne turene dine på sosiale medier og tagg oss!
        </p>
      </section>

      <section className="text-start my-8 space-y-4">
        <h2 className="text-2xl font-bold text-white">
          4. Donér etter løpeuka
        </h2>
        <p>
          Etter løpeuka sender vi ut informasjon om hvordan du donerer, hvor
          donasjoner går til{" "}
          <Link
            href="https://mentalhelse.no"
            target="_blank"
            className="underline text-blue-300 hover:text-blue-400"
          >
            Mental Helse
          </Link>
          .
        </p>
      </section>
    </div>
  );
};

export default RunningPage;
