import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // @ts-expect-error: global.prisma is not typed, but we ensure it is a PrismaClient
  if (!global.prisma) {
    // @ts-expect-error: global.prisma is not typed, but we ensure it is a PrismaClient
    global.prisma = new PrismaClient();
  }

  // @ts-expect-error: global.prisma is not typed, but we ensure it is a PrismaClient
  prisma = global.prisma;
}

export default prisma;
