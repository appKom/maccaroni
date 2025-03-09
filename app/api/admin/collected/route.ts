import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

    const collected = await req.json();

    if (!collected) {
      return NextResponse.json(
        { error: "Missing collected item" },
        { status: 400 }
      );
    }

    await prisma.collected.create({
      data: collected,
    });

    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
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

    const collected = await req.json();

    if (!collected) {
      return NextResponse.json(
        { error: "Missing collected item" },
        { status: 400 }
      );
    }

    await prisma.collected.update({
      where: { id: collected.id },
      data: collected,
    });

    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
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
        { error: "Missing collected ID" },
        { status: 400 }
      );
    }

    await prisma.collected.delete({
      where: { id: id as string },
    });

    revalidatePath("/");
    revalidatePath("/auksjon");

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
};
