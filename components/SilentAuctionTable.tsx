"use client";

import { useState } from "react";
import type { Collected, Auction, Bid } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, Award, CoinsIcon, Package } from "lucide-react";

interface Props {
  collections: Collected[];
  auctions: (Auction & { bids: Bid[] })[];
}

type SortDirection = "asc" | "desc" | null;

interface AuctionRow {
  id: string;
  description: string;
  amount: number;
  type: "SILENT_AUCTION" | "LIVE_AUCTION";
  nameOfBidder?: string;
}

const SilentAuctionTable = ({ collections, auctions }: Props) => {
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [sortField, setSortField] = useState<"amount" | "type">("amount");

  const silentRows: AuctionRow[] = collections.map((item) => ({
    id: item.id,
    description: item.description || "",
    amount: item.amount,
    type: "SILENT_AUCTION",
    nameOfBidder: item.nameOfBidder,
  }));

  const auctionRows: AuctionRow[] = auctions.map((auction) => {
    const highestBid: Bid | null =
      auction.bids && auction.bids.length > 0
        ? auction.bids.reduce((prev, current) =>
            current.amount > prev.amount ? current : prev
          )
        : null;
    return {
      id: auction.id,
      description: auction.name,
      amount: highestBid ? highestBid.amount : auction.startPrice,
      type: "SILENT_AUCTION",
      nameOfBidder: highestBid ? highestBid.nameOfBidder : undefined,
    };
  });

  const combinedRows: AuctionRow[] = [...silentRows, ...auctionRows];

  const sortedRows = [...combinedRows].sort((a, b) => {
    if (sortField === "amount") {
      return sortDirection === "asc"
        ? a.amount - b.amount
        : b.amount - a.amount;
    } else {
      return sortDirection === "asc"
        ? a.type.localeCompare(b.type)
        : b.type.localeCompare(a.type);
    }
  });

  const toggleSort = (field: "amount" | "type") => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const convertType = (type: string) => {
    switch (type) {
      case "SILENT_AUCTION":
        return "Stille auksjon";
      case "LIVE_AUCTION":
        return "Fysisk Auksjon";
      case "VIPPS":
        return "Vipps";
      default:
        return "Ukjent";
    }
  };

  const getSortIcon = () => {
    return (
      <ArrowDown className={`"h-4 w-4 md:h-5 md:w-5 text-lightBlue  transition-transform duration-300 ${sortDirection === "asc" ? "" : "rotate-180"}`} />
    );
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "SILENT_AUCTION":
        return "bg-tealBlue/20 border-tealBlue/50";
      case "LIVE_AUCTION":
        return "bg-gold/20 border-gold/50";
      case "VIPPS":
        return "bg-lightBlue/20 border-lightBlue/50";
      default:
        return "bg-gray-500/20 border-gray-500/50";
    }
  };

  return (
    <Card className="w-full mx-auto mt-16 bg-gradient-to-br from-tealBlue/10 to-lightBlue/30 border border-lightBlue shadow-lg">
      <CardHeader className="pb-0">
        <CardTitle className="text-2xl md:text-4xl font-bold text-start bg-clip-text text-transparent text-white py-4">
          Enkel oversikt auksjoner
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="md:hidden mb-4 flex gap-2">
          <button
            onClick={() => toggleSort("amount")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md bg-onlineBlue/80 border border-tealBlue/30 text-white ${
              sortField === "amount" ? "bg-tealBlue/40" : ""
            }`}
          >
            {sortField === "amount" && getSortIcon()}
            Pris
            {sortField === "amount" && (
              <span className="text-xs text-lightBlue/70 ml-1">
                ({sortDirection === "asc" ? "lavest først" : "høyest først"})
              </span>
            )}
          </button>
          <button
            onClick={() => toggleSort("type")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md bg-onlineBlue/80 border border-tealBlue/30 text-white ${
              sortField === "type" ? "bg-tealBlue/40" : ""
            }`}
          >
            {sortField === "type" && getSortIcon()}
            Type
            {sortField === "type" && (
              <span className="text-xs text-lightBlue/70 ml-1">
                ({sortDirection === "asc" ? "A-Z" : "Z-A"})
              </span>
            )}
          </button>
        </div>

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
                  className="text-base md:text-xl font-semibold text-white w-1/3 cursor-pointer hover:bg-tealBlue/10 transition-colors"
                  onClick={() => toggleSort("amount")}
                >
                  <div className="flex items-center gap-2">
                    {sortField === "amount" && getSortIcon()}
                    Pris
                    {sortField === "amount" ? (
                      <span className="text-xs text-lightBlue/70 ml-1">
                        (
                        {sortDirection === "asc"
                          ? "lavest først"
                          : "høyest først"}
                        )
                      </span>
                    ) : (
                      <span className="text-xs text-lightBlue/70 ml-1">
                        (Klikk for å sortere)
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="text-base md:text-xl font-semibold text-white w-1/3 cursor-pointer hover:bg-tealBlue/20 transition-colors relative"
                  onClick={() => toggleSort("type")}
                >
                  <div className="flex items-center gap-2">
                    {sortField === "type" && getSortIcon()}
                    Type
                    {sortField === "type" ? (
                      <span className="text-xs text-lightBlue/70 ml-1">
                        ({sortDirection === "asc" ? "A-Z" : "Z-A"})
                      </span>
                    ) : (
                      <span className="text-xs text-lightBlue/70 ml-1">
                        (Klikk for å sortere)
                      </span>
                    )}
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
              {sortedRows.map((item) => {
                return (
                  <TableRow
                    key={item.id}
                    className={`transition-colors cursor-default ${getTypeStyles(
                      item.type
                    )}`}
                  >
                    <TableCell className="font-medium text-lg md:text-xl py-4 text-white">
                      {item.description}
                    </TableCell>
                    <TableCell className="text-lg md:text-xl py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">
                          {item.amount}
                        </span>
                        <span className="text-lightBlue/70">kr</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-lg md:text-xl py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">
                          {convertType(item.type)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-lg md:text-xl py-4">
                      {item.nameOfBidder ? (
                        <span
                          className="font-medium text-gold bg-tealBlue/30 px-2 py-1 rounded inline-block max-w-[150px] lg:max-w-none truncate"
                          title={item.nameOfBidder}
                        >
                          {item.nameOfBidder}
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
              {sortedRows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-lightBlue/50"
                  >
                    Ingen auksjoner tilgjengelig
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden space-y-4">
          {sortedRows.length > 0 ? (
            sortedRows.map((item) => {
              return (
                <div
                  key={item.id}
                  className={`rounded-lg overflow-hidden border border-lightBlue/50 bg-onlineBlue/80 backdrop-blur-sm ${getTypeStyles(
                    item.type
                  )}`}
                >
                  <div className="p-4 border-b border-tealBlue/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-lightBlue" />
                      <h3 className="font-medium text-lg text-white">
                        {item.description}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <div className="flex items-center gap-2 text-lightBlue/70 text-sm mb-1">
                          {sortField === "amount" && (
                            <CoinsIcon className="h-4 w-4 text-lightBlue" />
                          )}
                          Pris
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-white text-lg">
                            {item.amount}
                          </span>
                          <span className="text-lightBlue/70">kr</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-lightBlue/70 text-sm mb-1">
                          <Award className="h-4 w-4 text-lightBlue" />
                          Høyeste budgiver
                        </div>
                        {item.nameOfBidder ? (
                          <span className="font-medium text-gold bg-tealBlue/30 px-2 py-1 rounded inline-block">
                            {item.nameOfBidder}
                          </span>
                        ) : (
                          <span className="text-lightBlue/50 italic">
                            Ingen bud
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center gap-2 text-lightBlue/70 text-sm mb-1">
                        Type
                      </div>
                      <span className="font-medium text-white bg-tealBlue/30 px-2 py-1 rounded inline-block">
                        {convertType(item.type)}
                      </span>
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
