"use client";

import { useState } from "react";
import type { Auction, Bid } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Award, Package } from "lucide-react";

interface AuctionWithBids extends Auction {
  bids: Bid[];
}

interface Props {
  auctions: AuctionWithBids[];
}

type SortDirection = "asc" | "desc" | null;

const SilentAuctionTable = ({ auctions }: Props) => {
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const highestBid = (bids: Bid[]) => {
    if (bids.length === 0) {
      return null;
    }
    return bids.reduce((prev, current) =>
      prev.amount > current.amount ? prev : current
    );
  };

  const getAuctionPrice = (auction: AuctionWithBids) => {
    const highest = highestBid(auction.bids);
    return highest?.amount ?? auction.startPrice;
  };

  const sortedAuctions = [...auctions].sort((a, b) => {
    const priceA = getAuctionPrice(a);
    const priceB = getAuctionPrice(b);

    return sortDirection === "asc" ? priceA - priceB : priceB - priceA;
  });

  const toggleSort = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const getSortIcon = () => {
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4 md:h-5 md:w-5 text-lightBlue animate-pulse" />
    ) : (
      <ArrowDown className="h-4 w-4 md:h-5 md:w-5 text-lightBlue animate-pulse" />
    );
  };

  return (
    <Card className="w-full mx-auto mt-16 bg-gradient-to-br from-tealBlue/10 to-lightBlue/30 border border-lightBlue shadow-lg">
      <CardHeader className="pb-0">
        <CardTitle className="text-2xl md:text-4xl font-bold text-start bg-clip-text text-transparent text-white py-4">
          Stille auksjoner
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        {/* Sort button for mobile view */}
        <div className="md:hidden mb-4">
          <button
            onClick={toggleSort}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-onlineBlue/80 border border-tealBlue/30 text-white"
          >
            {getSortIcon()}
            Sorter etter pris
            <span className="text-xs text-lightBlue/70 ml-1">
              ({sortDirection === "asc" ? "lavest først" : "høyest først"})
            </span>
          </button>
        </div>

        {/* Desktop/Tablet View (hidden on mobile) */}
        <div className="hidden md:block rounded-lg overflow-hidden border border-lightBlue/50 bg-onlineBlue backdrop-blur-sm">
          <Table>
            <TableHeader className="bg-onlineBlue/80 border-b border-tealBlue/30">
              <TableRow>
                <TableHead className="text-base md:text-xl font-semibold text-white w-1/3">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 md:h-5 md:w-5 text-lightBlue" />
                    Auksjon
                  </div>
                </TableHead>
                <TableHead
                  className="text-base md:text-xl font-semibold text-white w-1/3 cursor-pointer hover:bg-tealBlue/20 transition-colors"
                  onClick={toggleSort}
                >
                  <div className="flex items-center gap-2">
                    {getSortIcon()}
                    Pris
                    <span className="text-xs text-lightBlue/70 ml-1">
                      (
                      {sortDirection === "asc"
                        ? "lavest først"
                        : "høyest først"}
                      )
                    </span>
                  </div>
                </TableHead>
                <TableHead className="text-base md:text-xl font-semibold text-white w-1/3">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 md:h-5 md:w-5 text-lightBlue" />
                    Høyeste budgiver
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAuctions.map((item, index) => {
                const highest = highestBid(item.bids);

                return (
                  <TableRow
                    key={index}
                    className="transition-colors hover:bg-tealBlue/20 cursor-default"
                  >
                    <TableCell className="font-medium text-lg md:text-xl py-4 text-white">
                      {item.name}
                    </TableCell>
                    <TableCell className="text-lg md:text-xl py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">
                          {highest?.amount ?? item.startPrice}
                        </span>
                        <span className="text-lightBlue/70">kr</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-lg md:text-xl py-4">
                      {highest?.nameOfBidder ? (
                        <span className="font-medium text-gold bg-tealBlue/30 px-2 py-1 rounded">
                          {highest.nameOfBidder}
                        </span>
                      ) : (
                        <span className="text-lightBlue/50 italic">
                          Ingen bud
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {sortedAuctions.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-8 text-lightBlue/50"
                  >
                    Ingen auksjoner tilgjengelig
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile View (hidden on tablet and up) */}
        <div className="md:hidden space-y-4">
          {sortedAuctions.length > 0 ? (
            sortedAuctions.map((item, index) => {
              const highest = highestBid(item.bids);

              return (
                <div
                  key={index}
                  className="rounded-lg overflow-hidden border border-lightBlue/50 bg-onlineBlue/80 backdrop-blur-sm"
                >
                  <div className="p-4 border-b border-tealBlue/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-lightBlue" />
                      <h3 className="font-medium text-lg text-white">
                        {item.name}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <div className="flex items-center gap-2 text-lightBlue/70 text-sm mb-1">
                          {getSortIcon()}
                          Pris
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-white text-lg">
                            {highest?.amount ?? item.startPrice}
                          </span>
                          <span className="text-lightBlue/70">kr</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-lightBlue/70 text-sm mb-1">
                          <Award className="h-4 w-4 text-lightBlue" />
                          Høyeste budgiver
                        </div>
                        {highest?.nameOfBidder ? (
                          <span className="font-medium text-gold bg-tealBlue/30 px-2 py-1 rounded inline-block">
                            {highest.nameOfBidder}
                          </span>
                        ) : (
                          <span className="text-lightBlue/50 italic">
                            Ingen bud
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-lg overflow-hidden border border-lightBlue/50 bg-onlineBlue/80 backdrop-blur-sm p-6 text-center text-lightBlue/50">
              Ingen auksjoner tilgjengelig
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SilentAuctionTable;
