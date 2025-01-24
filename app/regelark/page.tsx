import Rulesheet from "@/components/Rulesheet";

export default function AuctionItemsPage() {
  const data = {
    rulesheet: {
      id: 1,
      title: "Regel 1",
      description: "Beskrivelse 1",
      _id: "1",
      markdown: "Markdown content",
    },
  };

  return (
    <div>
      <Rulesheet rulesheet={data.rulesheet} />
    </div>
  );
}
