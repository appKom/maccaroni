import type { Auction, Bid } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { GavelIcon, User2Icon } from "lucide-react";

interface ExtendedBid extends Bid {
  Auction: Auction;
}

interface Props {
  bids: ExtendedBid[];
}

const NewActivities = ({ bids }: Props) => {
  // Sort bids by most recent first (assuming there's a createdAt field)
  // If there's no timestamp field, we'll just use the array order
  const sortedBids = [...bids].sort((a, b) => {
    if ("createdAt" in a && "createdAt" in b) {
      return (
        //eslint-disable-next-line
        new Date(b.createdAt as any).getTime() -
        //eslint-disable-next-line
        new Date(a.createdAt as any).getTime()
      );
    }
    return 0;
  });

  return (
    <div className="w-full">
      <h3 className="text-3xl font-semibold mt-16 mb-6 text-purple-100">
        Nylig aktivitet
      </h3>

      {sortedBids.length === 0 ? (
        <Card className="bg-purple-950 border-purple-800">
          <CardContent className="p-6 text-center text-purple-300">
            Ingen nylige bud ennå.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedBids.map((bid) => (
            <Card
              key={bid.id}
              className="overflow-hidden transition-all hover:shadow-purple-700/30 bg-purple-950 border-purple-800"
            >
              <CardContent className="p-0">
                <div className="flex items-start p-4 gap-4">
                  <div className="flex-shrink-0 bg-purple-800/50 p-3 rounded-full">
                    <GavelIcon className="h-5 w-5 text-purple-300" />
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
                  {"createdAt" in bid && (
                    <p className="text-xs text-purple-400 mt-1">
                      {formatDistanceToNow(
                        //eslint-disable-next-line
                        new Date(bid.createdAt as any),
                        { addSuffix: true }
                      )}
                    </p>
                  )}
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
