import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: { json: () => PromiseLike<{ id: any; amount: any; nameOfBidder: any; auctionId: any; }> | { id: any; amount: any; nameOfBidder: any; auctionId: any; }; }) {
  const { id, amount, nameOfBidder, auctionId } = await req.json();

  if (!amount || !nameOfBidder || !auctionId) {
    return NextResponse.json({ error: 'Amount, nameOfBidder, and auctionId are required' }, { status: 400 });
  }

  try {
    const newBid = await prisma.bid.create({
      data: {
        id,
        amount,
        nameOfBidder,
        auctionId, // Include the auction ID
      },
    });
    return NextResponse.json(newBid, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating bid' }, { status: 500 });
  }
}