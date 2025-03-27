import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const numberOfDonations = await prisma.collected.count();

    const highestGoal = await prisma.prizeGoal.findFirst({
      orderBy: {
        goal: "desc",
      },
    });

    const totalCollected = await prisma.collected.aggregate({
      _sum: {
        amount: true,
      },
    });

    return NextResponse.json({
      numberOfDonations,
      highestGoal,
      totalCollected,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
};
