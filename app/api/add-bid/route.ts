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

  const { amount, nameOfBidder, auctionId } = await req.json();

  if (!amount || !nameOfBidder) {
    return NextResponse.json(
      { error: "Amount and nameOfBidder are required" },
      { status: 400 }
    );
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

  if (auction.minimumIncrease > amount) {
    return NextResponse.json(
      { error: "Beløpet er lavere en minimum økningen" },
      { status: 400 }
    );
  }

  try {
    const newBid = await prisma.bid.create({
      data: {
        amount: amount,
        nameOfBidder: nameOfBidder,
        owId: session.user.owId,
        Auction: { connect: { id: auctionId } },
      },
    });

    revalidatePath("/");
    revalidatePath("/auksjon");
    return NextResponse.json(newBid, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error creating bid" + error },
      { status: 500 }
    );
  }
};
