import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id, amount, nameOfBidder } = await req.json();

  if (!amount || !nameOfBidder) {
    return NextResponse.json(
      { error: "Amount and nameOfBidder are required" },
      { status: 400 }
    );
  }

  try {
    const newBid = await prisma.bid.create({
      data: {
        id,
        amount,
        nameOfBidder,
      },
    });
    return NextResponse.json(newBid, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating bid" + error },
      { status: 500 }
    );
  }
};
