import { LinkIcon } from "lucide-react";

const OnloveBanner = () => {
  return (
    <section className="flex flex-row w-full mb-8 justify-center items-center gap-1 bg-gray-800 rounded-lg py-6">
      <LinkIcon className="size-12 text-gold" />
      <div className="text-5xl font-bold flex items-center gap-2">
        {`Gå til `} <h1 className="text-gold ">onlove.no</h1>
      </div>
    </section>
  );
};

export default OnloveBanner;
