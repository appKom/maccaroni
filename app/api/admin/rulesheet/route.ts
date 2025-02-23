import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.isAdmin) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { ruleSheet } = await req.json();

    if (!ruleSheet) {
      return NextResponse.json(
        { error: "Missing rule sheet" },
        { status: 400 }
      );
    }

    const existingRuleSheet = await prisma.ruleSheet.findFirst();

    if (existingRuleSheet) {
      await prisma.ruleSheet.update({
        where: { id: existingRuleSheet.id },
        data: { description: ruleSheet },
      });
    } else {
      await prisma.ruleSheet.create({ data: { description: ruleSheet } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
};
