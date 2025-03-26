"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export const fetchVippsCollections = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return { error: "Unauthorized" };
  }

  try {
    const vippsCollections = await prisma.collected.findMany({
      where: { type: "VIPPS", description: "Lodd" },
      orderBy: { order: "desc" },
    });

    return vippsCollections;
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
};
