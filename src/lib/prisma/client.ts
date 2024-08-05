import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    transactionOptions: {
      // The maximum amount of time prisma wait to acquire a transaction from the database.
      maxWait: 5000, // 5s
      // The maximum amount of time the interactive transaction can run before being canceled and rolled back.
      timeout: 10000, // 10s
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
