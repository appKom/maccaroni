import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = async () => {
  try {
    const ruleSheet = await prisma.ruleSheet.findFirst();

    if (!ruleSheet) {
      return NextResponse.json({ description: "" });
    }

    return NextResponse.json({ description: ruleSheet.description });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
};
