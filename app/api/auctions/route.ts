import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = async () => {
  try {
    const auctions = await prisma.auction.findMany({
      include: {
        bids: true, // Include bids in the response
      },
    });

    if (!auctions) {
      return NextResponse.json({ description: "Could not find any auctions" });
    }

    return NextResponse.json(auctions);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
};
