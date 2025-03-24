"use client";

import { motion } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Collected } from "@prisma/client";

interface Props {
  collected: Collected[];
}

const LiveAuctions = ({ collected }: Props) => {
  const liveAuctions = collected.reduce((acc: Collected[], type) => {
    if (type.type === "LIVE_AUCTION") {
      acc.push(type);
    }
    return acc;
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <section className="flex flex-col gap-6 py-8 bg-black text-white">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl md:text-4xl font-bold">Fysiske auksjoner</h1>
      </div>

      {liveAuctions.length === 0 ? (
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <CardContent className="pt-6">
            <p className="text-zinc-400 text-center">
              Ingen aktive auksjoner for øyeblikket
            </p>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          className="flex flex-col gap-4 w-full mx-auto"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {liveAuctions.map((auction) => (
            <motion.div key={auction.id} variants={item}>
              <Card className="overflow-hidden h-full border-2 border-zinc-800 transition-all duration-300 hover:border-purple-500 hover:shadow-lg bg-zinc-900 text-zinc-100">
                <CardHeader className="bg-purple-900/30 pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <Badge
                          variant="outline"
                          className="bg-purple-900/50 text-purple-100 border-purple-700 font-bold text-lg px-3 py-1"
                        >
                          {auction.amount.toLocaleString("no-NO")} kr
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl mt-2 line-clamp-1 text-zinc-100">
                    {auction.description || "Auction Item"}
                  </CardTitle>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default LiveAuctions;
