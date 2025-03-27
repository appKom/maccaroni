import ReactMarkdown from "react-markdown";
import prisma from "@/lib/prisma";
import rehypeRaw from "rehype-raw";
import MarkdownComponents from "@/components/markdown/MarkdownComponents";

export default async function AuctionItemsPage() {
  const rules = await prisma.ruleSheet.findFirst();

  if (!rules) {
    return <p>{`Fant ingen regler :(`}</p>;
  }

  return (
    <div className="flex flex-col items-start mx-auto max-w-4xl px-4">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={MarkdownComponents}
      >
        {rules.description}
      </ReactMarkdown>
    </div>
  );
}
