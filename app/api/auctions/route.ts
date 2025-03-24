import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";

export const GET = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const auctions = await prisma.auction.findMany({
      include: {
        bids: true,
      },
      orderBy: {
        bids: {
          _count: "desc",
        },
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
