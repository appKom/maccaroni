import type { Auction, Bid } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import { FlameIcon, User2Icon } from "lucide-react";

interface ExtendedBid extends Bid {
  Auction: Auction;
}

interface Props {
  bids: ExtendedBid[];
}

const NewActivities = ({ bids }: Props) => {
  return (
    <div className="w-full">
      <h3 className="text-3xl font-semibold mt-16 mb-6 text-purple-100">
        Nylig aktivitet
      </h3>

      {bids.length === 0 ? (
        <Card className="bg-purple-950 border-purple-800">
          <CardContent className="p-6 text-center text-purple-300">
            Ingen nylige bud ennå.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bids.map((bid) => (
            <Card
              key={bid.id}
              className="overflow-hidden transition-all hover:shadow-purple-700/30 bg-purple-950 border-purple-800"
            >
              <CardContent className="p-0">
                <div className="flex items-start p-4 gap-4">
                  <div className="flex-shrink-0 bg-purple-800/50 p-3 rounded-full">
                    <FlameIcon className="h-5 w-5 text-red-300" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <p className="font-medium text-lg  text-purple-100">
                          {bid.Auction.name}
                        </p>
                        <div className="flex items-center mt-1 text-sm text-purple-400">
                          <User2Icon className="h-3.5 w-3.5 mr-1" />
                          <span>{bid.nameOfBidder}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right pr-2 pb-2">
                  <p className="font-bold text-lg text-purple-200">
                    {bid.amount.toLocaleString()} kr
                  </p>
                  <p className="text-xs text-purple-400 mt-1">
                    {formatDistanceToNow(new Date(bid.createdAt), {
                      addSuffix: true,
                      locale: nb,
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewActivities;
