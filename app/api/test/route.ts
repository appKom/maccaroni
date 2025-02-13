import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: { json: () => PromiseLike<{ id: any; amount: any; nameOfBidder: any; }> | { id: any; amount: any; nameOfBidder: any; }; }) {
  const { id, amount, nameOfBidder } = await req.json();

  if (!amount || !nameOfBidder) {
    return NextResponse.json({ error: 'Amount and nameOfBidder are required' }, { status: 400 });
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
    return NextResponse.json({ error: 'Error creating bid' }, { status: 500 });
  }
}