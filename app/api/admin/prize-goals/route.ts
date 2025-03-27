import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { revalidatePath } from "next/cache";

export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.isAdmin) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const prizeGoal = await req.json();

    if (!prizeGoal) {
      return NextResponse.json(
        { error: "Missing auction item" },
        { status: 400 }
      );
    }

    await prisma.prizeGoal.create({
      data: {
        goal: prizeGoal.goal,
        description: prizeGoal.description,
      },
    });

    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.isAdmin) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const prizeGoal = await req.json();

    if (!prizeGoal) {
      return NextResponse.json(
        { error: "Missing auction item" },
        { status: 400 }
      );
    }

    await prisma.prizeGoal.update({
      where: { id: prizeGoal.id },
      data: prizeGoal,
    });

    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.isAdmin) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const id = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing auction ID" },
        { status: 400 }
      );
    }

    await prisma.prizeGoal.delete({
      where: { id: id as string },
    });

    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
};
