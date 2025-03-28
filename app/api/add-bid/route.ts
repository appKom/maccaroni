import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { amount, auctionId } = await req.json();

  if (!auctionId) {
    return NextResponse.json(
      { error: "Auction ID is required" },
      { status: 400 }
    );
  }

  if (amount === undefined || amount === null) {
    return NextResponse.json({ error: "Amount is required" }, { status: 400 });
  }

  if (!amount) {
    return NextResponse.json({ error: "Amount is required" }, { status: 400 });
  }

  if (
    typeof amount !== "number" ||
    isNaN(amount) ||
    amount <= 0 ||
    /[a-zA-Z]/.test(String(amount))
  ) {
    return NextResponse.json({ error: "Invalid bid amount" }, { status: 400 });
  }

  if (amount > 1000000) {
    return NextResponse.json({ error: "Beløpet er for høyt" }, { status: 400 });
  }

  const auction = await prisma.auction.findUnique({
    where: { id: auctionId },
    include: { bids: true },
  });

  if (!auction) {
    return NextResponse.json({ error: "Fant ikke auksjoner" }, { status: 404 });
  }

  if (auction.bids.length > 0) {
    const highestBid = auction.bids.reduce((prev, current) =>
      prev.amount > current.amount ? prev : current
    );

    if (highestBid.amount >= amount) {
      return NextResponse.json(
        { error: "Beløpet er lavere en høyeste bud" },
        { status: 400 }
      );
    }
  }

  if (amount < auction.startPrice) {
    return NextResponse.json(
      { error: "Beløpet er lavere en startprisen" },
      { status: 400 }
    );
  }

  if (auction.minimumIncrease > amount) {
    return NextResponse.json(
      { error: "Beløpet er lavere en minimum økningen" },
      { status: 400 }
    );
  }

  try {
    const newBid = await prisma.$transaction(async (tx) => {
      const current = await tx.bid.findFirst({
        where: { auctionId },
        orderBy: { amount: "desc" },
      });

      const currentHighest = current?.amount || 0;
      if (amount <= currentHighest) {
        throw new Error("Bid too low or not higher than current bid");
      }

      const createdBid = await tx.bid.create({
        data: {
          amount: amount,
          nameOfBidder: session.user.name || "N/A",
          emailOfBidder: session.user.email,
          owId: session.user.owId,
          Auction: { connect: { id: auctionId } },
        },
      });

      await tx.collected.deleteMany({
        where: {
          auctionId: auctionId,
        },
      });

      await tx.collected.create({
        data: {
          amount: amount,
          type: "SILENT_AUCTION",
          description: auction.name,
          nameOfBidder: session.user.name || "N/A",
          emailOfBidder: session.user.email,
          auctionId: auctionId,
          bidId: createdBid.id,
        },
      });

      return createdBid;
    });

    revalidatePath("/");
    revalidatePath("/auksjon");
    return NextResponse.json(newBid, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error:
          "Error creating bid: " +
          (error instanceof Error ? error.message : "Unknown error"),
      },
      { status: 500 }
    );
  }
};
